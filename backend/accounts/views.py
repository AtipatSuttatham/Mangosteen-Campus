from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .models import EmailVerificationToken, User
from .serializers import (
    LoginSerializer,
    LogoutSerializer,
    RegisterSerializer,
    UserSerializer,
    VerifyEmailSerializer,
)

VERIFICATION_TOKEN_LIFETIME = timedelta(hours=24)


def _send_verification_email(user: User, verification: EmailVerificationToken) -> None:
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={verification.token}"
    send_mail(
        subject="ยืนยันอีเมลของคุณ — Mangosteen Campus",
        message=f"กดลิงก์นี้เพื่อยืนยันอีเมล: {verify_url}\n\nลิงก์หมดอายุใน 24 ชั่วโมง",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )


class RegisterView(APIView):
    """W1 ขั้นตอนที่ 1 — POST /api/auth/register"""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # atomic: ถ้าส่งอีเมลล้มเหลว ต้อง rollback ทั้ง user + token ไปด้วย
        # กันเคส "สมัครสำเร็จแต่ไม่เคยได้อีเมล แล้วสมัครซ้ำไม่ได้เพราะอีเมลถูกใช้ไปแล้ว"
        with transaction.atomic():
            user = serializer.save()
            verification = EmailVerificationToken.objects.create(
                user=user,
                purpose=EmailVerificationToken.Purpose.VERIFY_EMAIL,
                expires_at=timezone.now() + VERIFICATION_TOKEN_LIFETIME,
            )
            _send_verification_email(user, verification)

        return Response(
            {"detail": "สมัครสมาชิกสำเร็จ กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ"},
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    """W1 ขั้นตอนที่ 2 — GET /api/auth/verify?token=..."""

    permission_classes = [AllowAny]

    def get(self, request):
        serializer = VerifyEmailSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "ยืนยันอีเมลสำเร็จ"})


class LoginView(APIView):
    """POST /api/auth/login — รับได้ทั้ง email หรือ student_or_staff_id"""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


class LogoutView(APIView):
    """POST /api/auth/logout — blacklist refresh token ที่ส่งมา"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            token = RefreshToken(serializer.validated_data["refresh"])
            token.blacklist()
        except TokenError as exc:
            raise ValidationError({"refresh": "refresh token ไม่ถูกต้องหรือถูกใช้ไปแล้ว"}) from exc
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    """GET /api/auth/me — ข้อมูล user ปัจจุบัน ใช้โดย dashboard shell ฝั่ง frontend"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)
