from rest_framework import viewsets
from api.serializers import *
from api.models import *
from django_filters.rest_framework import DjangoFilterBackend


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class PersonalViewSet(viewsets.ModelViewSet):
    queryset = Personal.objects.all()
    serializer_class = PersonalSerializer


class NotesViewSet(viewsets.ModelViewSet):
    queryset = Notes.objects.all()
    serializer_class = NotesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        "content_type__app_label": ["exact"],
        "content_type__model": ["exact"],
        "object_id": ["exact"],
        "id": ["exact"],
    }
