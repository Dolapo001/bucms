from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView
)

# Version 1 API URLs pattern mounts
api_v1_patterns = [
    path('auth/', include('apps.authentication.urls')),
    path('users/', include('apps.users.urls')),
    path('announcements/', include('apps.announcements.urls')),
    path('programs/', include('apps.programs.urls')),
    path('sermons/', include('apps.sermons.urls')),
    path('notifications/', include('apps.notifications.urls')),
    path('analytics/', include('apps.analytics.urls')),
    path('common/', include('apps.common.urls')),
]

urlpatterns = [
    # Django Admin Portal
    path('admin/', admin.site.urls),

    # Versioned API
    path('api/v1/', include(api_v1_patterns)),

    # OpenAPI Schema JSON endpoint
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),

    # Interactive Swagger Documentation
    path('api/docs/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Alternative ReDoc Documentation
    path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Serve media and static files in development mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
