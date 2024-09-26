from django.contrib import admin
from django.urls import path, include
from api import urls as API

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(API)),
]
