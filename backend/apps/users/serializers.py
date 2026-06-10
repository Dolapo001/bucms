from rest_framework import serializers
from apps.users.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    """
    Standard serializer for CustomUser instances.
    """
    class Meta:
        model = CustomUser
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'role',
            'matric_no',
            'profile_picture',
            'is_active',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'role', 'is_active', 'created_at', 'updated_at')


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer to handle user self-updates (profile).
    """
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'matric_no', 'profile_picture')

    def validate_profile_picture(self, value):
        if value:
            # 5MB file size validation limit
            max_size = 5 * 1024 * 1024
            if value.size > max_size:
                raise serializers.ValidationError("Profile picture size cannot exceed 5MB.")
            # Format validation
            valid_extensions = ['.jpg', '.jpeg', '.png']
            import os
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError("Unsupported profile picture format. Use JPG or PNG.")
        return value

    def validate(self, attrs):
        # Obtain instance and incoming attributes
        role = getattr(self.instance, 'role', None)
        matric_no = attrs.get('matric_no', getattr(self.instance, 'matric_no', None))
        
        # If the user is a MEMBER, matric_no should be required
        if role == 'MEMBER' and not matric_no:
            raise serializers.ValidationError({"matric_no": "Matriculation number is required for member accounts."})
            
        return attrs
