from rest_framework import serializers
from .models import Case, Note

class CaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = ['id', 'title', 'company_name', 'description', 'created_at']

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'case', 'content', 'classification', 'created_at']
        read_only_fields = ["classification"]