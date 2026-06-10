from django.urls import path
from apps.analytics.views import AnalyticsView

urlpatterns = [
    path('', AnalyticsView.as_view(), name='admin-analytics'),
]
