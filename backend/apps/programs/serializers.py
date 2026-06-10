import os
from rest_framework import serializers
from apps.programs.models import Program
from apps.users.serializers import UserSerializer

class ProgramSerializer(serializers.ModelSerializer):
    """
    Serializer mapping Program records to REST responses.
    Includes custom validation for promotional banner images.
    """
    created_by_detail = UserSerializer(source='created_by', read_only=True)

    class Meta:
        model = Program
        fields = (
            'id',
            'title',
            'description',
            'venue',
            'event_date',
            'banner_image',
            'created_by',
            'created_by_detail',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')

    def validate_banner_image(self, value):
        if value:
            # 5MB limit
            max_size = 5 * 1024 * 1024
            if value.size > max_size:
                raise serializers.ValidationError("Banner image size cannot exceed 5MB.")
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in ['.jpg', '.jpeg', '.png']:
                raise serializers.ValidationError("Banner image must be JPG or PNG.")
        return value
