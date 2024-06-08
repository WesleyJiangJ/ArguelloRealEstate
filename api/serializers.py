from rest_framework import serializers
from api.models import *


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
