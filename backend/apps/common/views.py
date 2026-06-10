from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class HealthCheckView(APIView):
    """
    A simple health check endpoint to verify backend service status.
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"status": "healthy", "service": "BUCMS Backend"}, status=status.HTTP_200_OK)
