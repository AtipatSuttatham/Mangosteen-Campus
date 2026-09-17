import getpass

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError

from accounts.models import User


class Command(BaseCommand):
    """สร้างบัญชี Admin คนแรกสำหรับ dev/ทดสอบ — ทดแทน UI 'Admin User Management' ที่ยังไม่ทำใน phase นี้"""

    help = "Seed the first Administrator account (role=admin, is_email_verified=True)"

    def add_arguments(self, parser):
        parser.add_argument("--email", required=True)
        parser.add_argument("--first-name", required=True)
        parser.add_argument("--last-name", required=True)
        parser.add_argument("--password", required=False, help="ถ้าไม่ใส่จะถามแบบ interactive")

    def handle(self, *args, **options):
        email = User.objects.normalize_email(options["email"])

        if User.objects.filter(email__iexact=email).exists():
            raise CommandError(f"มี user ที่ใช้อีเมล {email} อยู่แล้ว")

        password = options.get("password") or getpass.getpass("Password: ")
        try:
            validate_password(password)
        except ValidationError as exc:
            raise CommandError("; ".join(exc.messages)) from exc

        User.objects.create_superuser(
            email=email,
            password=password,
            first_name=options["first_name"],
            last_name=options["last_name"],
        )
        self.stdout.write(self.style.SUCCESS(f"สร้างบัญชี admin สำเร็จ: {email}"))
