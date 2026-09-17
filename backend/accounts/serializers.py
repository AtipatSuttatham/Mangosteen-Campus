from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import EmailVerificationToken, User


class UserSerializer(serializers.ModelSerializer):
    """ใช้กับ /api/auth/me — คืนข้อมูลผู้ใช้ปัจจุบันให้ frontend (dashboard shell ใช้ role นี้)"""

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "student_or_staff_id",
            "role",
            "first_name",
            "last_name",
            "first_name_en",
            "last_name_en",
            "is_email_verified",
            "avatar_url",
        )
        read_only_fields = fields


class RegisterSerializer(serializers.Serializer):
    """W1 — สมัครเองด้วยอีเมล (channel 2) เปิดรับทุกโดเมนอีเมล → role=student เสมอ"""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)

    def validate_email(self, value: str) -> str:
        value = User.objects.normalize_email(value)
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("อีเมลนี้ถูกใช้งานแล้ว")
        return value

    def validate_password(self, value: str) -> str:
        try:
            validate_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(list(exc.messages)) from exc
        return value

    def create(self, validated_data: dict) -> User:
        return User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            role=User.Role.STUDENT,
            is_email_verified=False,
        )


class LoginSerializer(serializers.Serializer):
    """login รับได้ทั้ง email หรือ student_or_staff_id (2 ช่องทางเข้าระบบตาม CLAUDE.md)"""

    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs: dict) -> dict:
        identifier = attrs["identifier"].strip()
        password = attrs["password"]

        user = (
            User.objects.filter(email__iexact=identifier).first()
            or User.objects.filter(student_or_staff_id=identifier).first()
        )

        # ข้อความ error รวมเป็นแบบเดียวกันเสมอ กันเดาว่า user มีอยู่จริงหรือไม่ (user enumeration)
        generic_error = "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง"
        if user is None or not user.check_password(password):
            raise serializers.ValidationError(generic_error)
        if not user.is_active:
            raise serializers.ValidationError("บัญชีนี้ถูกระงับการใช้งาน")
        if not user.is_email_verified:
            raise serializers.ValidationError("กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ")

        refresh = RefreshToken.for_user(user)
        refresh["role"] = user.role
        refresh["email"] = user.email

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data,
        }


class VerifyEmailSerializer(serializers.Serializer):
    """W1 ขั้นตอนที่ 2 — เช็ค token ยืนยันอีเมล"""

    token = serializers.CharField()

    def validate_token(self, value: str) -> EmailVerificationToken:
        verification = EmailVerificationToken.objects.filter(
            token=value,
            purpose=EmailVerificationToken.Purpose.VERIFY_EMAIL,
            used_at__isnull=True,
        ).first()
        if verification is None or verification.expires_at < timezone.now():
            raise serializers.ValidationError("ลิงก์ยืนยันอีเมลไม่ถูกต้องหรือหมดอายุแล้ว")
        return verification

    def save(self, **kwargs) -> User:
        verification: EmailVerificationToken = self.validated_data["token"]
        verification.used_at = timezone.now()
        verification.save(update_fields=["used_at", "updated_at"])

        user = verification.user
        user.is_email_verified = True
        user.save(update_fields=["is_email_verified", "updated_at"])
        return user


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
