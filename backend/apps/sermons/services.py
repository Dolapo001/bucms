from django.db import transaction
from apps.sermons.models import Sermon
from apps.notifications.models import Notification
from apps.users.models import CustomUser

class SermonService:
    """
    Service layer containing operations related to Sermon uploads.
    """
    @staticmethod
    @transaction.atomic
    def upload_sermon(title, speaker, description, admin_user, audio_file=None, document=None, video_url=None, thumbnail=None):
        """
        Saves a new sermon and notifies all active chapel members.
        """
        sermon = Sermon.objects.create(
            title=title,
            speaker=speaker,
            description=description,
            audio_file=audio_file,
            document=document,
            video_url=video_url,
            thumbnail=thumbnail,
            created_by=admin_user
        )

        # Broadcast notification about new sermon
        members = CustomUser.objects.filter(role='MEMBER', is_active=True)
        notifications = [
            Notification(
                user=member,
                message=f"New Sermon available: '{title}' by {speaker}."
            ) for member in members
        ]
        Notification.objects.bulk_create(notifications)

        return sermon
