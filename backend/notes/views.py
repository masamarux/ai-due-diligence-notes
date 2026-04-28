from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Case, Note
from .serializers import CaseSerializer, NoteSerializer

class CaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all().order_by('-created_at')
    serializer_class = CaseSerializer

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().order_by('-created_at')
    serializer_class = NoteSerializer

    @action(detail=True, methods=['post'])
    def classify(self, request, pk=None):
        note = self.get_object()
        content = note.content.lower()

        if any(word in content for word in ["lawsuit", "fraud", "debt", "risk"]):
            note.classification = "risk"
        elif any(word in content for word in ["growth", "revenue", "market", "opportunity"]):
            note.classification = "opportunity"
        else:
            note.classification = "neutral"

        note.save()
        return Response({
            'id': note.id,
            'classification': note.classification,
        })