from django.db import models
from django.conf import settings
from medications.models import Medication

class AdherenceLog(models.Model):
    STATUS_CHOICES = [
        ('taken', 'Taken'),
        ('skipped', 'Skipped'),
        ('snoozed', 'Snoozed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE)
    datetime = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    reason = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.medication.name} - {self.status} at {self.datetime}"

class RefillLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.medication.name} refill on {self.date}"
