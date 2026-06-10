import uuid
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from django.db import transaction

from apps.users.models import CustomUser
from apps.announcements.models import Announcement
from apps.programs.models import Program
from apps.sermons.models import Sermon
from apps.notifications.models import Notification

class Command(BaseCommand):
    help = "Seeds the BUCMS database with realistic, high-quality institutional mock records."

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Clearing existing BUCMS chapel records..."))
        
        # Safe cascading deletes of mock items
        Announcement.objects.all().delete()
        Program.objects.all().delete()
        Sermon.objects.all().delete()
        Notification.objects.all().delete()
        
        # Safely remove old seed users but keep generic site superusers
        CustomUser.objects.filter(email__endswith="@bowen.edu.ng").delete()
        
        self.stdout.write(self.style.SUCCESS("Database records cleared successfully."))
        self.stdout.write(self.style.WARNING("Seeding Bowen University Custom Users..."))

        # 1. CREATE ADMIN USERS
        admin_user = CustomUser.objects.create_user(
            email="admin@bowen.edu.ng",
            password="AdminPassword123!",
            first_name="Chapel",
            last_name="Administrator",
            role="ADMIN",
            is_staff=True
        )
        self.stdout.write(self.style.SUCCESS("-> Seeding admin user: admin@bowen.edu.ng (Pass: AdminPassword123!)"))

        # 2. CREATE MEMBER USERS
        student1 = CustomUser.objects.create_user(
            email="faith@bowen.edu.ng",
            password="MemberPassword123!",
            first_name="Faith",
            last_name="Oluwatobiloba",
            role="MEMBER",
            matric_no="BU21ICT1005"
        )
        
        student2 = CustomUser.objects.create_user(
            email="member@bowen.edu.ng",
            password="MemberPassword123!",
            first_name="Ayomide",
            last_name="Emmanuel",
            role="MEMBER",
            matric_no="BU21ICT1006"
        )
        self.stdout.write(self.style.SUCCESS("-> Seeding student members: faith@bowen.edu.ng, member@bowen.edu.ng (Pass: MemberPassword123!)"))

        now = timezone.now()

        # 3. CREATE ANNOUNCEMENTS
        self.stdout.write(self.style.WARNING("Seeding Chapel Announcements..."))
        
        ann1 = Announcement.objects.create(
            title="Mid-Semester Spiritual Awakening Crusade 2026",
            content="### Theme: The Outpouring of Grace\n\nAll students are invited to the Mid-Semester Crusade starting this Wednesday at the Worship Center. Attendance is mandatory for all undergraduate students.\n\n* **Time:** 5:00 PM Daily\n* **Speaker:** Pastor Tunde Bakare\n\nBe punctual and come expectant!",
            created_by=admin_user,
            is_published=True,
            is_pinned=True,
            expires_at=now + timedelta(days=5)
        )

        ann2 = Announcement.objects.create(
            title="Update on Chapel Seat Reservation System",
            content="To promote orderly liturgical service, the Bowen Chapel seat reservation is now fully active. Ensure you reserve your chapel seats via your student dashboard prior to Sunday morning services.",
            created_by=admin_user,
            is_published=True,
            is_pinned=False,
            expires_at=now + timedelta(days=14)
        )

        ann3 = Announcement.objects.create(
            title="Devotional Study Notes: Walking in Divine Wisdom",
            content="Chapel study guide for this week is now available for download. Let us reflect on Proverbs 3:5-6 during our personal quiet time.\n\n*\"Trust in the Lord with all thine heart; and lean not unto thine own understanding.\"*",
            created_by=admin_user,
            is_published=True,
            is_pinned=True
        )

        ann4 = Announcement.objects.create(
            title="[Draft Notice] Guest Minister Welcoming Guidelines",
            content="Private guidelines regarding hosting external guest ministers in Bowen University guest house facilities.",
            created_by=admin_user,
            is_published=False,
            is_pinned=False
        )

        self.stdout.write(self.style.SUCCESS(f"-> Generated {Announcement.objects.count()} Announcements."))

        # 4. CREATE PROGRAMS (EVENTS)
        self.stdout.write(self.style.WARNING("Seeding Chapel Programs and Events..."))

        prog1 = Program.objects.create(
            title="Bowen Night of Worship (B.N.W)",
            description="An atmosphere of intense adoration, praise, and deep worship. Join guest ministers Nathaniel Bassey and Dunsin Oyekan as we lift up the name of Jesus over Bowen University.",
            venue="Bowen Worship Center (Large Hall)",
            event_date=now + timedelta(days=6),
            created_by=admin_user
        )

        prog2 = Program.objects.create(
            title="Sunday Liturgical Communion Service",
            description="Our weekly standard Sunday service. Join the university chaplaincy team for holy communion, scripture recitals, and classical choral performances.",
            venue="Bowen Chapel Auditorium",
            event_date=now + timedelta(days=2),
            created_by=admin_user
        )

        prog3 = Program.objects.create(
            title="Mid-Week Grace and Study Hour",
            description="Deep biblical expositions regarding academic excellence, work ethics, and godly living in an contemporary world.",
            venue="Chapel Fellowship Hall",
            event_date=now - timedelta(days=3),  # Past event
            created_by=admin_user
        )

        self.stdout.write(self.style.SUCCESS(f"-> Generated {Program.objects.count()} Programs/Events."))

        # 5. CREATE SERMONS
        self.stdout.write(self.style.WARNING("Seeding Sermon Archive..."))

        serm1 = Sermon.objects.create(
            title="The Pursuit of Divine Purpose",
            speaker="Pastor Dr. A. A. Ph.D",
            description="Discovering god-given destiny and running with vision amidst academic and developmental stages.",
            video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            created_by=admin_user
        )

        serm2 = Sermon.objects.create(
            title="Walking in Academic Integrity",
            speaker="Rev. Mrs. Deborah Folorunsho",
            description="Reflecting the moral standard of Bowen University through honesty, dedication, and spiritual values during examinations.",
            video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            created_by=admin_user
        )

        serm3 = Sermon.objects.create(
            title="Overcoming Hardships and Anxieties",
            speaker="Dr. Samson Kolawole",
            description="A comforting sermon on managing stress, anxiety, and school expectations with absolute faith in Christ.",
            created_by=admin_user
        )

        self.stdout.write(self.style.SUCCESS(f"-> Generated {Sermon.objects.count()} Sermons."))

        # 6. CREATE NOTIFICATIONS
        self.stdout.write(self.style.WARNING("Seeding User Notifications..."))

        Notification.objects.create(
            user=student1,
            message="Your Sunday seat reservation code is #BU-5412. Attendance desk opens at 7:30 AM.",
            is_read=False
        )

        Notification.objects.create(
            user=student1,
            message="New Sermon uploaded: 'Walking in Academic Integrity' by Rev. Mrs. Deborah Folorunsho.",
            is_read=True
        )

        Notification.objects.create(
            user=student2,
            message="Important Notice Pinned: 'Mid-Semester Spiritual Awakening Crusade 2026' has been announced.",
            is_read=False
        )

        self.stdout.write(self.style.SUCCESS(f"-> Generated {Notification.objects.count()} User Notifications."))
        self.stdout.write(self.style.SUCCESS("--- BUCMS SEED DATA LOADED SUCCESS ---"))
