from django.test import TestCase
from apps.users.models import CustomUser
from apps.analytics.services import AnalyticsService

class AnalyticsTests(TestCase):
    def setUp(self):
        # Create a member and an admin user
        self.admin = CustomUser.objects.create_user(
            email="admin@bowen.edu.ng",
            password="password123",
            first_name="Admin",
            last_name="Staff",
            role="ADMIN"
        )
        self.member = CustomUser.objects.create_user(
            email="student@bowen.edu.ng",
            password="password123",
            first_name="Student",
            last_name="One",
            role="MEMBER",
            matric_no="BU21ACC1044"
        )

    def test_metrics_service_gathers_correct_counts(self):
        metrics = AnalyticsService.get_dashboard_metrics()
        self.assertEqual(metrics['total_users'], 2)
        self.assertEqual(metrics['total_members'], 1)
        self.assertEqual(metrics['total_admins'], 1)
        self.assertEqual(metrics['total_announcements'], 0)
        self.assertEqual(metrics['total_sermons'], 0)
        self.assertEqual(metrics['total_events'], 0)
