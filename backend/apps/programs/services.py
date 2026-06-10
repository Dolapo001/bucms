from django.db import transaction
from apps.programs.models import Program
from apps.notifications.models import Notification
from apps.users.models import CustomUser

class ProgramService:
    """
    Service layer containing operations related to Chapel Programs and Events.
    """
    @staticmethod
    @transaction.atomic
    def schedule_program(title, description, venue, event_date, admin_user, banner_image=None):
        """
        Schedules a new chapel event and alerts all active members.
        """
        program = Program.objects.create(
            title=title,
            description=description,
            venue=venue,
            event_date=event_date,
            banner_image=banner_image,
            created_by=admin_user
        )

        # Broadcast notification about new program
        members = CustomUser.objects.filter(role='MEMBER', is_active=True)
        notifications = [
            Notification(
                user=member,
                message=f"New event scheduled: '{title}' on {event_date.strftime('%Y-%m-%d %H:%M')}. Venue: {venue}"
            ) for member in members
        ]
        Notification.objects.bulk_create(notifications)

        return program
