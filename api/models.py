from django.db import models


class Customer(models.Model):
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30)
    first_surname = models.CharField(max_length=30)
    second_surname = models.CharField(max_length=30)
    birthdate = models.DateField()
    phone_number = models.CharField(max_length=8)
    email = models.EmailField(max_length=255, unique=True, blank=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.middle_name} {self.first_surname} {self.second_surname}"
