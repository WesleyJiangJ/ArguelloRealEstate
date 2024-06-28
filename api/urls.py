from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from api import views

router = routers.DefaultRouter()
router.register(r"user", views.UserViewSet)
router.register(r"customer", views.CustomerViewSet)
router.register(r"personal", views.PersonalViewSet)
router.register(r"notes", views.NotesViewSet)
router.register(r"plot", views.PlotViewSet)
router.register(r"sale", views.SaleViewSet)
router.register(r"installment", views.InstallmentViewSet)
router.register(r"commission", views.CommissionViewSet)
router.register(r"penalty", views.PenaltyViewSet)
router.register(r"penalty_history", views.PenaltyHistoryViewSet)
router.register(r"penalty_payments", views.PenaltyPaymentsViewSet)
router.register(r"pdfinfo", views.PDFInfoViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("docs/", include_docs_urls(title="API")),
    path("export-database/", views.export_database, name="export-database"),
    path("import-database/", views.import_database, name="import-database"),
]

urlpatterns += router.urls
