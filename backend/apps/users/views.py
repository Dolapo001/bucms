from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.users.models import CustomUser
from apps.users.serializers import UserSerializer, UserUpdateSerializer
from apps.users.permissions import IsAdminOrSelf
from apps.common.permissions import IsAdminUserRole

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user accounts.
    - Admins: full access (list, retrieve, update, delete)
    - Members/Self: self-profile reading and updates.
    """
    queryset = CustomUser.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['email', 'first_name', 'last_name', 'matric_no']
    ordering_fields = ['created_at', 'email']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update', 'me']:
            return UserUpdateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == 'list':
            # Only admin can list users
            return [IsAdminUserRole()]
        elif self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            # Admin or user themselves
            return [IsAdminOrSelf()]
        elif self.action == 'me':
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='me')
    def me(self, request):
        """
        Endpoint to retrieve and update the authenticated user's profile.
        GET /api/v1/users/me/
        PUT/PATCH /api/v1/users/me/
        """
        user = request.user
        if request.method == 'GET':
            serializer = UserSerializer(user, context={'request': request})
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            partial = (request.method == 'PATCH')
            serializer = UserUpdateSerializer(user, data=request.data, partial=partial, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            # Return updated full user details
            full_serializer = UserSerializer(user, context={'request': request})
            return Response(full_serializer.data, status=status.HTTP_200_OK)
