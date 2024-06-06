from rest_framework import serializers
from api.models import *


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = "__all__"
