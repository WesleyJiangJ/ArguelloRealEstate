from django.contrib import admin
from api import models

admin.site.register(models.Customer)
admin.site.register(models.Personal)
admin.site.register(models.Notes)
admin.site.register(models.Plot)
admin.site.register(models.Sale)
admin.site.register(models.Installment)
admin.site.register(models.Commission)
admin.site.register(models.Penalty)
admin.site.register(models.PenaltyHistory)
admin.site.register(models.PenaltyPayments)
admin.site.register(models.PDFInformation)