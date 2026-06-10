import os
from rest_framework import serializers
from apps.sermons.models import Sermon
from apps.users.serializers import UserSerializer

class SermonSerializer(serializers.ModelSerializer):
    """
    Serializer mapping Sermon models to REST JSON payloads.
    Includes comprehensive security and format validations for media uploads.
    """
    created_by_detail = UserSerializer(source='created_by', read_only=True)

    class Meta:
        model = Sermon
        fields = (
            'id',
            'title',
            'speaker',
            'description',
            'audio_file',
            'document',
            'video_url',
            'thumbnail',
            'created_by',
            'created_by_detail',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')

    def validate_audio_file(self, value):
        if value:
            # 50MB limit
            max_size = 50 * 1024 * 1024
            if value.size > max_size:
                raise serializers.ValidationError("Audio file size cannot exceed 50MB.")
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in ['.mp3', '.wav', '.m4a', '.aac']:
                raise serializers.ValidationError("Unsupported audio format. Use MP3, WAV, M4A, or AAC.")
        return value

    def validate_document(self, value):
        if value:
            # 15MB limit
            max_size = 15 * 1024 * 1024
            if value.size > max_size:
                raise serializers.ValidationError("Document file size cannot exceed 15MB.")
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in ['.pdf', '.docx', '.doc']:
                raise serializers.ValidationError("Unsupported document format. Use PDF, DOCX, or DOC.")
        return value

    def validate_thumbnail(self, value):
        if value:
            # 5MB limit
            max_size = 5 * 1024 * 1024
            if value.size > max_size:
                raise serializers.ValidationError("Thumbnail image size cannot exceed 5MB.")
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in ['.jpg', '.jpeg', '.png']:
                raise serializers.ValidationError("Thumbnail must be JPG or PNG.")
        return value
