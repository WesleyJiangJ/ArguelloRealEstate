from django.urls import include, path
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from api import views

router = routers.DefaultRouter()

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("docs/", include_docs_urls(title="API")),
]

urlpatterns += router.urls
