from rest_framework import viewsets
from api.serializers import *
from api.models import *


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
