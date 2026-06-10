from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.programs.views import ProgramViewSet

router = DefaultRouter()
router.register('', ProgramViewSet, basename='program')

urlpatterns = [
    path('', include(router.urls)),
]
