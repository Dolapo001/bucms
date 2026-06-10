from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from apps.users.models import CustomUser
from apps.programs.models import Program

class ProgramTests(TestCase):
    def setUp(self):
        self.admin = CustomUser.objects.create_user(
            email="admin@bowen.edu.ng",
            password="password123",
            first_name="Admin",
            last_name="Staff"
        )
        self.p1 = Program.objects.create(
            title="Future Event",
            description="Looking forward to this",
            venue="Chapel",
            event_date=timezone.now() + timedelta(days=5),
            created_by=self.admin
        )
        self.p2 = Program.objects.create(
            title="Past Event",
            description="This already happened",
            venue="Main Hall",
            event_date=timezone.now() - timedelta(days=2),
            created_by=self.admin
        )

    def test_upcoming_filter(self):
        upcoming = Program.objects.filter(event_date__gte=timezone.now())
        self.assertEqual(upcoming.count(), 1)
        self.assertEqual(upcoming.first().title, "Future Event")

    def test_past_filter(self):
        past = Program.objects.filter(event_date__lt=timezone.now())
        self.assertEqual(past.count(), 1)
        self.assertEqual(past.first().title, "Past Event")
