import secrets

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models

from common.models import TimeStampedModel


def _generate_token() -> str:
    return secrets.token_urlsafe(32)


class UserManager(BaseUserManager):
    """login หลักคือ email (ไม่ใช้ username แบบ Django default) — ดู docs/database-erd.md §1"""

    use_in_migrations = True

    def _create_user(self, email: str, password: str | None, **extra_fields):
        if not email:
            raise ValueError("User ต้องมีอีเมล (email)")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email: str, password: str | None = None, **extra_fields):
        extra_fields.setdefault("role", User.Role.STUDENT)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email: str, password: str | None = None, **extra_fields):
        extra_fields.setdefault("role", User.Role.ADMIN)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_email_verified", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser ต้องมี is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser ต้องมี is_superuser=True")
        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    """Custom user — field ตาม docs/database-erd.md §1 (freeze v1.3)"""

    class Role(models.TextChoices):
        ADMIN = "admin", "Administrator"
        TEACHER = "teacher", "Teacher"
        STUDENT = "student", "Student"

    # 2 ช่องทางเข้าระบบ: email (สมัครเอง) หรือ student_or_staff_id (admin สร้างให้)
    email = models.EmailField(unique=True)
    student_or_staff_id = models.CharField(max_length=32, unique=True, null=True, blank=True)
    role = models.CharField(max_length=16, choices=Role.choices, default=Role.STUDENT)

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    first_name_en = models.CharField(max_length=150, null=True, blank=True)
    last_name_en = models.CharField(max_length=150, null=True, blank=True)

    is_email_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # เข้า Django admin site ได้หรือไม่

    avatar_url = models.URLField(null=True, blank=True)

    # ผู้สร้างบัญชี (admin) — nullable เพราะสมัครเองไม่มีผู้สร้าง
    created_by = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.SET_NULL, related_name="created_users"
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self) -> str:
        return f"{self.email} ({self.role})"


class EmailVerificationToken(TimeStampedModel):
    class Purpose(models.TextChoices):
        VERIFY_EMAIL = "verify_email", "Verify email"
        RESET_PASSWORD = "reset_password", "Reset password"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="verification_tokens")
    token = models.CharField(max_length=64, unique=True, default=_generate_token)
    purpose = models.CharField(max_length=20, choices=Purpose.choices)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.user.email} - {self.purpose}"
