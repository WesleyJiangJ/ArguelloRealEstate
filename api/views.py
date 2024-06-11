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


class PlotViewSet(viewsets.ModelViewSet):
    queryset = Plot.objects.all()
    serializer_class = PlotSerializer


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer


class InstallmentViewSet(viewsets.ModelViewSet):
    queryset = Installment.objects.all()
    serializer_class = InstallmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id_sale__id_customer", "id_sale"]
