from django.contrib import admin

from .models import EmailVerificationToken, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """สำหรับดู/ทดสอบข้อมูลผู้ใช้ตอน dev เท่านั้น — UI สร้าง/แก้บัญชีจริงเป็นฟีเจอร์ Admin User Management ถัดไป"""

    ordering = ("email",)
    list_display = ("email", "student_or_staff_id", "role", "is_email_verified", "is_active", "is_staff")
    list_filter = ("role", "is_email_verified", "is_active")
    search_fields = ("email", "student_or_staff_id", "first_name", "last_name")
    readonly_fields = ("password", "last_login", "created_at", "updated_at")


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "purpose", "expires_at", "used_at")
    list_filter = ("purpose",)
    readonly_fields = ("token", "created_at", "updated_at")
