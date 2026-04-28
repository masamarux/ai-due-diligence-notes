from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .classifier import classify_note
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
        note.classification = classify_note(note.content)
        note.save()

        serializer = self.get_serializer(note)
        return Response(serializer.data)