from django.db import models
from django.conf import settings

class Medication(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='medications')
    name = models.CharField(max_length=255)
    schedule = models.CharField(max_length=255)
    dose = models.CharField(max_length=255)
    start_quantity = models.PositiveIntegerField(null=True, blank=True)
    dose_quantity = models.PositiveIntegerField(null=True, blank=True)
    times_per_day = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} for {self.user.username}"
