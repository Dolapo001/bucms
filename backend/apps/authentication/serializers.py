import os
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from apps.users.models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer to handle public member registration.
    Enforces password complexity checks and secures role limits.
    """
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = (
            'email',
            'first_name',
            'last_name',
            'password',
            'password_confirm',
            'matric_no',
            'profile_picture'
        )

    def validate_email(self, value):
        normalized_email = value.strip().lower()
        if CustomUser.objects.filter(email=normalized_email).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return normalized_email

    def validate_profile_picture(self, value):
        if value:
            # 5MB limit
            max_size = 5 * 1024 * 1024
            if value.size > max_size:
                raise serializers.ValidationError("Profile picture size cannot exceed 5MB.")
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in ['.jpg', '.jpeg', '.png']:
                raise serializers.ValidationError("Profile picture must be JPG or PNG.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
            
        # Matriculation number is mandatory for member registration
        if not attrs.get('matric_no'):
            raise serializers.ValidationError({"matric_no": "Bowen University matriculation number is required."})

        # Normalize matric_no
        attrs['matric_no'] = attrs['matric_no'].strip().upper()
        if CustomUser.objects.filter(matric_no=attrs['matric_no']).exists():
            raise serializers.ValidationError({"matric_no": "A user with this matriculation number already exists."})
            
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        # Hardcode the role to MEMBER to prevent unauthorized ADMIN creation
        user = CustomUser.objects.create_user(
            password=password,
            role='MEMBER',
            **validated_data
        )
        return user


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing user password.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password_confirm": "New passwords do not match."})
        return attrs
