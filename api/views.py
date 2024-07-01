import os
import smtplib
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from api.serializers import *
from api.models import *


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def export_database(request):
    database_path = os.path.join(settings.BASE_DIR, "db.sqlite3")
    with open(database_path, "rb") as f:
        response = HttpResponse(f.read(), content_type="application/x-sqlite3")
        response["Content-Disposition"] = f'attachment; filename="db.sqlite3"'
        return response


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
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


def send_database():
    try:
        info = PDFInformation.objects.get(pk=1)
        DATABASE_PATH = os.path.join(settings.BASE_DIR, "db.sqlite3")
        EMAIL_USER = info.backup_email
        EMAIL_PASSWORD = info.app_password
        RECIPIENT_EMAIL = info.backup_email

        # Create email
        msg = MIMEMultipart()
        msg["From"] = EMAIL_USER
        msg["To"] = RECIPIENT_EMAIL
        msg["Subject"] = (
            f"Respaldo de Bienes Raices Arguello - {datetime.now().strftime('%d/%m/%Y')}"
        )

        # Attach the file
        with open(DATABASE_PATH, "rb") as f:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(f.read())
        encoders.encode_base64(part)
        part.add_header(
            "Content-Disposition",
            f"attachment; filename={os.path.basename(DATABASE_PATH)}",
        )
        msg.attach(part)

        # Send the email
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_USER, RECIPIENT_EMAIL, msg.as_string())

        return JsonResponse(
            {
                "status": "success",
                "message": "Base de datos enviada por correo electrónico.",
            }
        )

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
