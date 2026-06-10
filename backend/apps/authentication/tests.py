from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.users.models import CustomUser

class AuthenticationAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('auth-register')
        self.login_url = reverse('auth-login')
        self.registration_payload = {
            "email": "testmember@bowen.edu.ng",
            "password": "BowenPassword123!",
            "password_confirm": "BowenPassword123!",
            "first_name": "Dolapo",
            "last_name": "Adedolapo",
            "matric_no": "BU20SCI1004"
        }

    def test_registration_creates_member_successfully(self):
        response = self.client.post(self.register_url, self.registration_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertEqual(response.data['user']['role'], 'MEMBER')
        
        # Verify db insert
        user_exists = CustomUser.objects.filter(email="testmember@bowen.edu.ng").exists()
        self.assertTrue(user_exists)

    def test_registration_fails_without_matric_no(self):
        payload = self.registration_payload.copy()
        payload.pop('matric_no')
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('matric_no', response.data)
