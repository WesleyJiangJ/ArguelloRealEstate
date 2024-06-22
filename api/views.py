from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from api.serializers import *
from api.models import *


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
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id_customer", "id_personal"]


class InstallmentViewSet(viewsets.ModelViewSet):
    queryset = Installment.objects.all()
    serializer_class = InstallmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id_sale__id_customer", "id_sale"]


class CommissionViewSet(viewsets.ModelViewSet):
    queryset = Commission.objects.all()
    serializer_class = CommissionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id_personal"]


class PenaltyViewSet(viewsets.ModelViewSet):
    queryset = Penalty.objects.all()
    serializer_class = PenaltySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id_sale"]


class PenaltyHistoryViewSet(viewsets.ModelViewSet):
    queryset = PenaltyHistory.objects.all()
    serializer_class = PenaltyHistorySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id_penalty"]

class PenaltyPaymentsViewSet(viewsets.ModelViewSet):
    queryset = PenaltyPayments.objects.all()
    serializer_class = PenaltyPaymentsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id_penalty"]
