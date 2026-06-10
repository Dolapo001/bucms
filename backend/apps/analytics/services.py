from django.db.models import Count
from apps.users.models import CustomUser
from apps.announcements.models import Announcement
from apps.sermons.models import Sermon
from apps.programs.models import Program

class AnalyticsService:
    """
    Service layer containing operations related to dashboard aggregates.
    Uses ORM aggregations only.
    """
    @staticmethod
    def get_dashboard_metrics():
        """
        Gathers database counts and generates a list of recent activities.
        """
        # Gather total counts
        total_users = CustomUser.objects.count()
        total_members = CustomUser.objects.filter(role='MEMBER').count()
        total_admins = CustomUser.objects.filter(role='ADMIN').count()
        total_announcements = Announcement.objects.count()
        total_sermons = Sermon.objects.count()
        total_events = Program.objects.count()

        # Build recent activity feed
        recent_announcements = Announcement.objects.all()[:5]
        recent_sermons = Sermon.objects.all()[:5]
        recent_events = Program.objects.all()[:5]

        activities = []
        for a in recent_announcements:
            activities.append({
                "type": "ANNOUNCEMENT",
                "title": a.title,
                "created_at": a.created_at,
                "details": f"Pinned: {a.is_pinned} | Published: {a.is_published}"
            })
        for s in recent_sermons:
            activities.append({
                "type": "SERMON",
                "title": s.title,
                "created_at": s.created_at,
                "details": f"Speaker: {s.speaker}"
            })
        for p in recent_events:
            activities.append({
                "type": "EVENT",
                "title": p.title,
                "created_at": p.created_at,
                "details": f"Venue: {p.venue} | Date: {p.event_date.strftime('%Y-%m-%d %H:%M')}"
            })

        # Sort combined list by created_at desc, limit to top 5
        activities.sort(key=lambda x: x['created_at'], reverse=True)
        recent_activities = activities[:5]

        return {
            "total_users": total_users,
            "total_members": total_members,
            "total_admins": total_admins,
            "total_announcements": total_announcements,
            "total_sermons": total_sermons,
            "total_events": total_events,
            "recent_activities": recent_activities
        }
