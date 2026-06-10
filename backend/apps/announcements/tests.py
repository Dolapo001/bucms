from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from apps.users.models import CustomUser
from apps.announcements.models import Announcement

class AnnouncementTests(TestCase):
    def setUp(self):
        self.admin = CustomUser.objects.create_user(
            email="admin@bowen.edu.ng",
            password="password123",
            first_name="Admin",
            last_name="User",
            role="ADMIN"
        )
        self.member = CustomUser.objects.create_user(
            email="student@bowen.edu.ng",
            password="password123",
            first_name="Student",
            last_name="User",
            role="MEMBER",
            matric_no="BU21ACC1011"
        )
        # Create standard published announcement
        self.a1 = Announcement.objects.create(
            title="Scribbles",
            content="Normal published announcement",
            created_by=self.admin,
            is_published=True
        )
        # Create expired announcement
        self.a2 = Announcement.objects.create(
            title="Expired notice",
            content="This should be hidden",
            created_by=self.admin,
            is_published=True,
            expires_at=timezone.now() - timedelta(days=1)
        )
        # Create unpublished announcement
        self.a3 = Announcement.objects.create(
            title="Draft",
            content="Not ready yet",
            created_by=self.admin,
            is_published=False
        )

    def test_member_only_sees_active_published_announcements(self):
        # We'll assert query filters directly
        active_announcements = Announcement.objects.filter(
            is_published=True
        ).filter(
            models.Q(expires_at__isnull=True) | models.Q(expires_at__gt=timezone.now())
        )
        self.assertEqual(active_announcements.count(), 1)
        self.assertEqual(active_announcements.first().title, "Scribbles")
