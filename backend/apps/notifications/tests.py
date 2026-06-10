from django.test import TestCase
from apps.users.models import CustomUser
from apps.notifications.models import Notification

class NotificationTests(TestCase):
    def setUp(self):
        self.member = CustomUser.objects.create_user(
            email="student@bowen.edu.ng",
            password="password123",
            first_name="Student",
            last_name="One",
            matric_no="BU21ACC1030"
        )
        self.n1 = Notification.objects.create(
            user=self.member,
            message="Welcome to BUCMS chapel system"
        )

    def test_default_state_is_unread(self):
        self.assertFalse(self.n1.is_read)

    def test_mark_as_read(self):
        self.n1.is_read = True
        self.n1.save()
        self.assertTrue(Notification.objects.get(id=self.n1.id).is_read)
