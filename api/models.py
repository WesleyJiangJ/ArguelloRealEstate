from django.db import models
from django.core.validators import MinLengthValidator
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType


class Notes(models.Model):
    name = models.CharField(max_length=100)
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
    notes = GenericRelation(Notes)
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
    notes = GenericRelation(Notes)
    status = models.BooleanField(default=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.middle_name} {self.first_surname} {self.second_surname}"
