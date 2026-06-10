from django.db import transaction
from apps.users.models import CustomUser

class UserService:
    """
    Service layer class containing user management actions.
    Encapsulates core business transactions around user operations.
    """
    @staticmethod
    @transaction.atomic
    def create_user(email, password, first_name, last_name, role='MEMBER', matric_no=None, **extra_fields):
        """
        Creates a new CustomUser instance.
        """
        user = CustomUser.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=role,
            matric_no=matric_no,
            **extra_fields
        )
        return user
