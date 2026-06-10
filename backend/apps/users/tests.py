from django.test import TestCase
from apps.users.models import CustomUser

class UserModelTests(TestCase):
    def test_create_user_with_email_successful(self):
        user = CustomUser.objects.create_user(
            email="STUDENT@bowen.edu.ng",
            password="securepassword123",
            first_name="John",
            last_name="Doe",
            role="MEMBER",
            matric_no="BU21ACC1002"
        )
        self.assertEqual(user.email, "student@bowen.edu.ng")
        self.assertEqual(user.role, "MEMBER")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)

    def test_create_superuser(self):
        user = CustomUser.objects.create_superuser(
            email="admin@bowen.edu.ng",
            password="adminpassword123",
            first_name="Admin",
            last_name="Staff"
        )
        self.assertEqual(user.email, "admin@bowen.edu.ng")
        self.assertEqual(user.role, "ADMIN")
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
