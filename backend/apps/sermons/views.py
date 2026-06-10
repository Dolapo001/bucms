from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.sermons.models import Sermon
from apps.sermons.serializers import SermonSerializer
from apps.sermons.permissions import IsSermonManagerOrReadOnly

class SermonViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing sermons.
    - Admins: Complete CRUD access (upload, retrieve, update, delete).
    - Members: Read-only access.
    """
    queryset = Sermon.objects.all()
    serializer_class = SermonSerializer
    permission_classes = [permissions.IsAuthenticated, IsSermonManagerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'speaker']
    ordering_fields = ['created_at', 'title', 'speaker']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        # Custom speaker filtering support
        speaker_param = self.request.query_params.get('speaker')
        if speaker_param:
            queryset = queryset.filter(speaker__icontains=speaker_param)
        return queryset

    def perform_create(self, serializer):
        # Automatically assign admin user as creator
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'], url_path='latest')
    def latest(self, request):
        """
        Retrieves the latest 3 sermons published on the platform.
        GET /api/v1/sermons/latest/
        """
        latest_sermons = Sermon.objects.all()[:3]
        serializer = self.get_serializer(latest_sermons, many=True)
        return Response(serializer.data)
