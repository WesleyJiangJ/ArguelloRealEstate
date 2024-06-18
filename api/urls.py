from django.urls import include, path
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from api import views

router = routers.DefaultRouter()
router.register(r"customer", views.CustomerViewSet)
router.register(r"personal", views.PersonalViewSet)
router.register(r"notes", views.NotesViewSet)
router.register(r"plot", views.PlotViewSet)
router.register(r"sale", views.SaleViewSet)
router.register(r"installment", views.InstallmentViewSet)
router.register(r"commission", views.CommissionViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("docs/", include_docs_urls(title="API")),
]

urlpatterns += router.urls
