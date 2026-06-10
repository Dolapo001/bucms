from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from apps.programs.models import Program
from apps.programs.serializers import ProgramSerializer
from apps.programs.permissions import IsProgramManagerOrReadOnly

class ProgramViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing chapel programs and events.
    - Admins: Complete CRUD access.
    - Members: Read-only access.
    """
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [permissions.IsAuthenticated, IsProgramManagerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'venue']
    ordering_fields = ['event_date', 'created_at']
    ordering = ['-event_date']

    def perform_create(self, serializer):
        # Automatically assign admin user as creator
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'], url_path='upcoming')
    def upcoming(self, request):
        """
        Retrieves all upcoming events (scheduled today or in the future).
        GET /api/v1/programs/upcoming/
        """
        now = timezone.now()
        upcoming_events = Program.objects.filter(event_date__gte=now).order_by('event_date')
        
        page = self.paginate_queryset(upcoming_events)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(upcoming_events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='past')
    def past(self, request):
        """
        Retrieves all past events (scheduled before today).
        GET /api/v1/programs/past/
        """
        now = timezone.now()
        past_events = Program.objects.filter(event_date__lt=now).order_by('-event_date')
        
        page = self.paginate_queryset(past_events)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(past_events, many=True)
        return Response(serializer.data)
