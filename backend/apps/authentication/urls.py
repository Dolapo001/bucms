from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from apps.authentication.views import RegisterView, CustomLoginView, LogoutView, ChangePasswordView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', CustomLoginView.as_view(), name='auth-login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
    path('change-password/', ChangePasswordView.as_view(), name='auth-change-password'),
]
