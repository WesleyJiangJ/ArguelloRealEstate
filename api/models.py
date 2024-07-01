import re
from django.db import models
from django.core.validators import MinLengthValidator
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User


class Notes(models.Model):
    name = models.CharField(max_length=100, blank=True)
    content = models.TextField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    # Fields for Polymorphic Relationship
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    def __str__(self):
        return f"{self.name}"


class Customer(models.Model):
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30)
    first_surname = models.CharField(max_length=30)
    second_surname = models.CharField(max_length=30)
    birthdate = models.DateField()
    dni = models.CharField(max_length=16, validators=[MinLengthValidator(16)])
    phone_number = models.CharField(max_length=8)
    email = models.EmailField(max_length=255, blank=True)
    note = GenericRelation(Notes)
    status = models.BooleanField(default=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.middle_name} {self.first_surname} {self.second_surname}"


class Personal(models.Model):
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30)
    first_surname = models.CharField(max_length=30)
    second_surname = models.CharField(max_length=30)
    birthdate = models.DateField()
    dni = models.CharField(max_length=16, validators=[MinLengthValidator(16)])
    phone_number = models.CharField(max_length=8)
    email = models.EmailField(max_length=255, blank=True)
    note = GenericRelation(Notes)
    status = models.BooleanField(default=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.middle_name} {self.first_surname} {self.second_surname}"


@receiver(post_save, sender=Personal)
def create_user_for_personal(sender, instance, created, **kwargs):
    if created:
        first_name = instance.first_name.lower()
        last_name = instance.first_surname.lower()
        # Replace spaces with underscores and remove other special characters
        pswd = f"{first_name}{last_name}"
        pswd = re.sub(r"\W+", "", pswd)  # Remove non-alphanumeric characters
        # Create a user with username, email and password
        User.objects.create_user(
            username=instance.email,
            email=instance.email,
            password=pswd,
            first_name=instance.first_name,
            last_name=instance.first_surname,
        )


class Plot(models.Model):
    STATUS_CHOICES = [(0, "Available"), (1, "Process"), (2, "Sold")]
    number = models.CharField(max_length=10, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    note = GenericRelation(Notes)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=0)

    def __str__(self):
        return f"{self.number} - {self.status}"


class Commission(models.Model):
    id_personal = models.ForeignKey(Personal, on_delete=models.CASCADE)
    id_plot = models.ForeignKey(Plot, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)


class Sale(models.Model):
    STATUS_CHOICES = [(0, "Active"), (1, "Completed"), (2, "Cancelled")]
    id_customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    id_personal = models.ForeignKey(Personal, on_delete=models.CASCADE)
    id_plot = models.ForeignKey(Plot, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    premium = models.DecimalField(max_digits=10, decimal_places=2)
    installments = models.PositiveIntegerField()
    total_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    date_paid = models.DateField(blank=True, null=True)
    sale_commission = models.DecimalField(max_digits=5, decimal_places=2)
    penalty_commission = models.DecimalField(max_digits=5, decimal_places=2)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=0)
    modified_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Plot {self.id_plot} sold to {self.id_customer} - {self.status}"


class Installment(models.Model):
    TYPE_CHOICES = [(0, "Premium"), (1, "Installment")]
    id_sale = models.ForeignKey(Sale, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=1, choices=TYPE_CHOICES)
    note = GenericRelation(Notes)
    date = models.DateField()
    created_at = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.id_sale}"


class Penalty(models.Model):
    id_sale = models.ForeignKey(Sale, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)


class PenaltyHistory(models.Model):
    id_penalty = models.ForeignKey(Penalty, on_delete=models.CASCADE)
    date = models.DateField()
    monthly_debt = models.DecimalField(max_digits=10, decimal_places=2)
    total_debt = models.DecimalField(max_digits=10, decimal_places=2)
    penalty = models.DecimalField(max_digits=10, decimal_places=2)


class PenaltyPayments(models.Model):
    TYPE_CHOICES = [(0, "Payment"), (1, "Exempt")]
    id_penalty = models.ForeignKey(Penalty, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=1, choices=TYPE_CHOICES)


class PDFInformation(models.Model):
    TYPE_CHOICES = [(0, "Tigo"), (1, "Claro")]
    name = models.CharField(max_length=100)
    bank_account = models.CharField(max_length=50)
    phone_number_one = models.CharField(max_length=8)
    phone_number_one_company = models.CharField(max_length=1, choices=TYPE_CHOICES)
    phone_number_two = models.CharField(max_length=8)
    phone_number_two_company = models.CharField(max_length=1, choices=TYPE_CHOICES)
    backup_email = models.EmailField(max_length=255, blank=False)
    app_password = models.CharField(max_length=256)
