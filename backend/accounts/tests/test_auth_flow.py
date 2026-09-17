from datetime import timedelta

import pytest
from django.core import mail
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import EmailVerificationToken, User

pytestmark = pytest.mark.django_db


@pytest.fixture
def client() -> APIClient:
    return APIClient()


def _register_payload(**overrides):
    payload = {
        "email": "student@example.com",
        "password": "S0meStrongPass!",
        "first_name": "สมชาย",
        "last_name": "ใจดี",
    }
    payload.update(overrides)
    return payload


def test_register_creates_unverified_student_and_sends_email(client):
    response = client.post(reverse("accounts:register"), _register_payload(), format="json")

    assert response.status_code == 201
    user = User.objects.get(email="student@example.com")
    assert user.role == User.Role.STUDENT
    assert user.is_email_verified is False
    assert len(mail.outbox) == 1
    assert "verify-email?token=" in mail.outbox[0].body


def test_register_rejects_duplicate_email(client):
    client.post(reverse("accounts:register"), _register_payload(), format="json")
    response = client.post(reverse("accounts:register"), _register_payload(), format="json")

    assert response.status_code == 400


def test_login_rejected_before_email_verified(client):
    client.post(reverse("accounts:register"), _register_payload(), format="json")

    response = client.post(
        reverse("accounts:login"),
        {"identifier": "student@example.com", "password": "S0meStrongPass!"},
        format="json",
    )

    assert response.status_code == 400


def test_verify_email_with_valid_token_then_login(client):
    client.post(reverse("accounts:register"), _register_payload(), format="json")
    user = User.objects.get(email="student@example.com")
    token = user.verification_tokens.get(purpose=EmailVerificationToken.Purpose.VERIFY_EMAIL)

    verify_response = client.get(reverse("accounts:verify"), {"token": token.token})
    assert verify_response.status_code == 200

    user.refresh_from_db()
    assert user.is_email_verified is True

    login_response = client.post(
        reverse("accounts:login"),
        {"identifier": "student@example.com", "password": "S0meStrongPass!"},
        format="json",
    )
    assert login_response.status_code == 200
    assert "access" in login_response.data
    assert "refresh" in login_response.data
    assert login_response.data["user"]["role"] == User.Role.STUDENT


def test_verify_email_with_expired_token_fails(client):
    user = User.objects.create_user(
        email="expired@example.com",
        password="S0meStrongPass!",
        first_name="A",
        last_name="B",
    )
    token = EmailVerificationToken.objects.create(
        user=user,
        purpose=EmailVerificationToken.Purpose.VERIFY_EMAIL,
        expires_at=timezone.now() - timedelta(hours=1),
    )

    response = client.get(reverse("accounts:verify"), {"token": token.token})

    assert response.status_code == 400
    user.refresh_from_db()
    assert user.is_email_verified is False


def test_login_with_student_or_staff_id(client):
    User.objects.create_user(
        email="teacher@example.com",
        password="S0meStrongPass!",
        first_name="ครู",
        last_name="สมศรี",
        role=User.Role.TEACHER,
        student_or_staff_id="EMP-001",
        is_email_verified=True,
    )

    response = client.post(
        reverse("accounts:login"),
        {"identifier": "EMP-001", "password": "S0meStrongPass!"},
        format="json",
    )

    assert response.status_code == 200
    assert response.data["user"]["role"] == User.Role.TEACHER


def test_login_generic_error_for_wrong_password(client):
    User.objects.create_user(
        email="student2@example.com",
        password="S0meStrongPass!",
        first_name="A",
        last_name="B",
        is_email_verified=True,
    )

    response = client.post(
        reverse("accounts:login"),
        {"identifier": "student2@example.com", "password": "wrong-password"},
        format="json",
    )

    assert response.status_code == 400


def test_refresh_and_logout_flow(client):
    user = User.objects.create_user(
        email="cycle@example.com",
        password="S0meStrongPass!",
        first_name="A",
        last_name="B",
        is_email_verified=True,
    )
    login_response = client.post(
        reverse("accounts:login"),
        {"identifier": "cycle@example.com", "password": "S0meStrongPass!"},
        format="json",
    )
    refresh_token = login_response.data["refresh"]
    access_token = login_response.data["access"]

    refresh_response = client.post(
        reverse("accounts:refresh"), {"refresh": refresh_token}, format="json"
    )
    assert refresh_response.status_code == 200
    assert "access" in refresh_response.data
    new_refresh_token = refresh_response.data["refresh"]

    # /me ต้องใช้ access token ได้
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
    me_response = client.get(reverse("accounts:me"))
    assert me_response.status_code == 200
    assert me_response.data["email"] == user.email

    logout_response = client.post(
        reverse("accounts:logout"), {"refresh": new_refresh_token}, format="json"
    )
    assert logout_response.status_code == 204

    # refresh token ที่ถูก blacklist แล้วต้องใช้ซ้ำไม่ได้
    reuse_response = client.post(
        reverse("accounts:refresh"), {"refresh": new_refresh_token}, format="json"
    )
    assert reuse_response.status_code == 401


def test_me_requires_authentication(client):
    response = client.get(reverse("accounts:me"))
    assert response.status_code == 401
