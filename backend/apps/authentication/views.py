from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from apps.authentication.serializers import RegisterSerializer, ChangePasswordSerializer
from apps.users.serializers import UserSerializer

class RegisterView(APIView):
    """
    Public registration endpoint for new Bowen University members.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT immediately on successful registration
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user, context={'request': request}).data
        
        return Response({
            "message": "User registered successfully.",
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            },
            "user": user_data
        }, status=status.HTTP_201_CREATED)


class CustomLoginView(TokenObtainPairView):
    """
    Custom login view that normalizes request emails and returns
    structured payloads including complete user data.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        # Normalize email in request data to support case-insensitivity
        data = request.data.copy()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        # Standard authentication check
        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response(
                {"detail": "No active account found with the given credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"detail": "This user account is currently deactivated."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user, context={'request': request}).data

        return Response({
            "message": "Login successful.",
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            },
            "user": user_data
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    Protected logout view. Blacklists the client refresh token.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"detail": "Refresh token is required to perform logout."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({
                "message": "Logout successful. Token blacklisted."
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST
            )


class ChangePasswordView(APIView):
    """
    Protected endpoint to update user passwords.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {"old_password": ["Incorrect password. Please verify current password."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            "message": "Password changed successfully."
        }, status=status.HTTP_200_OK)
