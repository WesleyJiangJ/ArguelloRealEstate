import os
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from dotenv import load_dotenv, set_key
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from api.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class PersonalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personal
        fields = "__all__"


class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = "__all__"


class PlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plot
        fields = "__all__"


class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(SaleSerializer, self).to_representation(instance)
        customer_representation = CustomerSerializer(instance.id_customer).data
        personal_representation = PersonalSerializer(instance.id_personal).data
        plot_representation = PlotSerializer(instance.id_plot).data
        representation["customer_data"] = customer_representation
        representation["personal_data"] = personal_representation
        representation["plot_data"] = plot_representation
        return representation


class InstallmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Installment
        fields = "__all__"


class CommissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commission
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(CommissionSerializer, self).to_representation(instance)
        plot_representation = PlotSerializer(instance.id_plot).data
        representation["plot_data"] = plot_representation
        return representation


class PenaltySerializer(serializers.ModelSerializer):
    class Meta:
        model = Penalty
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(PenaltySerializer, self).to_representation(instance)
        sale_representation = SaleSerializer(instance.id_sale).data
        representation["sale_data"] = sale_representation
        return representation


class PenaltyHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PenaltyHistory
        fields = "__all__"


class PenaltyPaymentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PenaltyPayments
        fields = "__all__"


class PDFInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFInformation
        fields = "__all__"


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email.")
        return value

    def save(self, reset_url=None):
        email = self.validated_data["email"]
        user = User.objects.get(email=email)

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Use reset_url if provided, otherwise construct a default URL
        if not reset_url:
            reset_path = reverse(
                "password_reset_confirm", kwargs={"uidb64": uid, "token": token}
            )
            # Remove the initial '/api/' from the URL
            reset_path = reset_path.replace("/api/", "/", 1)
            # Modify this with your desired base URL
            reset_url = f"{settings.CORS_ALLOWED_ORIGINS[0]}{reset_path}"

        send_mail(
            "Recuperar Contraseña - Bienes Raices Arguello",
            f"Use este enlace para restablecer su contraseña de {email}:\n{reset_url}",
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
        )


class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def save(self, uidb64, token):
        try:
            user_id = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid token or user ID.")

        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError("Invalid token.")

        user.set_password(self.validated_data["new_password"])
        user.save()


def set_env_variable(key, value):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    env_file = os.path.join(BASE_DIR, "RealEstate", ".env")
    lines = []
    with open(env_file, "r") as f:
        lines = f.readlines()

    with open(env_file, "w") as f:
        found = False
        for line in lines:
            if line.startswith(f"{key}="):
                f.write(f"{key}={value}\n")
                found = True
            else:
                f.write(line)
        if not found:
            f.write(f"{key}={value}\n")
    os.environ[key] = value


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        load_dotenv()
        try:
            info = PDFInformation.objects.first()
            user_email = info.backup_email
            user_password = info.app_password
            set_key(".env", "EMAIL_HOST_USER", user_email)
            set_key(".env", "EMAIL_HOST_PASSWORD", user_password)
        except PDFInformation.DoesNotExist:
            pass
        return token
