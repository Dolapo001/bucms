import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from apps.common.models import UUIDTimestampModel

class UserManager(BaseUserManager):
    """
    Custom manager for CustomUser.
    Handles user creation using email instead of username.
    """
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set.")
        email = self.normalize_email(email).lower()
        
        # Default role is MEMBER if not specified
        extra_fields.setdefault('role', 'MEMBER')
        
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
            
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin, UUIDTimestampModel):
    """
    Bowen University Custom User Model supporting ADMIN and MEMBER roles,
    and using email for authentication.
    """
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('MEMBER', 'Member'),
    )

    email = models.EmailField(
        unique=True,
        db_index=True,
        max_length=255,
        help_text="The primary email address of the user, used for sign-in."
    )
    first_name = models.CharField(
        max_length=150,
        help_text="User's first name."
    )
    last_name = models.CharField(
        max_length=150,
        help_text="User's last name."
    )
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='MEMBER',
        db_index=True,
        help_text="The access role determining permissions."
    )
    matric_no = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True,
        db_index=True,
        help_text="Bowen University matriculation number. Mandatory for members, optional for admin."
    )
    profile_picture = models.ImageField(
        upload_to='profiles/',
        null=True,
        blank=True,
        help_text="Optional profile avatar image."
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Designates whether this user account should be treated as active."
    )
    is_staff = models.BooleanField(
        default=False,
        help_text="Designates whether the user can log into the Django admin site."
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} ({self.role})"

    @property
    def is_admin(self):
        return self.role == 'ADMIN'

    @property
    def is_member(self):
        return self.role == 'MEMBER'
