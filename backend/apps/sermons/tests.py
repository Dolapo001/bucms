from django.test import TestCase
from apps.users.models import CustomUser
from apps.sermons.models import Sermon

class SermonTests(TestCase):
    def setUp(self):
        self.admin = CustomUser.objects.create_user(
            email="admin@bowen.edu.ng",
            password="password123",
            first_name="Admin",
            last_name="Staff"
        )
        self.s1 = Sermon.objects.create(
            title="Faith and Grace",
            speaker="Pastor Caleb",
            description="A talk on faith",
            created_by=self.admin
        )
        self.s2 = Sermon.objects.create(
            title="Hope and Joy",
            speaker="Pastor Joshua",
            description="A talk on hope",
            created_by=self.admin
        )
        self.s3 = Sermon.objects.create(
            title="Love and Peace",
            speaker="Pastor Joshua",
            description="A talk on love",
            created_by=self.admin
        )

    def test_filter_by_speaker(self):
        joshua_sermons = Sermon.objects.filter(speaker__icontains="Joshua")
        self.assertEqual(joshua_sermons.count(), 2)

    def test_latest_sermons_returns_three(self):
        latest = Sermon.objects.all()[:3]
        self.assertEqual(latest.count(), 3)
