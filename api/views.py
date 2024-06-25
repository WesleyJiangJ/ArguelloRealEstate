import os
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from RealEstate import settings
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


class PDFInfoViewSet(viewsets.ModelViewSet):
    queryset = PDFInformation.objects.all()
    serializer_class = PDFInfoSerializer


def export_database(request):
    database_path = os.path.join(settings.BASE_DIR, "db.sqlite3")
    with open(database_path, "rb") as f:
        response = HttpResponse(f.read(), content_type="application/x-sqlite3")
        response["Content-Disposition"] = f'attachment; filename="db.sqlite3"'
        return response


@csrf_exempt
def import_database(request):
    if request.method == "POST" and request.FILES.get("database"):
        database_file = request.FILES["database"]
        if database_file.name.endswith(".sqlite3"):
            database_path = os.path.join(settings.BASE_DIR, "db.sqlite3")
            with open(database_path, "wb+") as destination:
                for chunk in database_file.chunks():
                    destination.write(chunk)
            return JsonResponse(
                {
                    "status": "success",
                    "message": "Base de datos importada satisfactoriamente",
                }
            )
        else:
            return JsonResponse(
                {"status": "error", "message": "Formato de archivo incorrecto"}
            )
    else:
        return JsonResponse(
            {"status": "error", "message": "No seleccionó ningún archivo"}
        )
