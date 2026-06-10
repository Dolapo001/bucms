from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.analytics.services import AnalyticsService
from apps.analytics.serializers import AnalyticsSerializer
from apps.analytics.permissions import IsAnalyticsViewer

class AnalyticsView(APIView):
    """
    Admin-only dashboard metrics endpoint.
    Aggregates user registrations, sermons uploaded, and recent activities.
    """
    permission_classes = [permissions.IsAuthenticated, IsAnalyticsViewer]

    def get(self, request):
        metrics = AnalyticsService.get_dashboard_metrics()
        serializer = AnalyticsSerializer(metrics)
        return Response(serializer.data, status=status.HTTP_200_OK)
