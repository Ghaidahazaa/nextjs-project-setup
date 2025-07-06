from django.db import models
from django.conf import settings
from medications.models import Medication

class SideEffectLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE)
    symptom = models.CharField(max_length=255)
    severity = models.PositiveIntegerField()
    date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='side_effects/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.medication.name} side effect on {self.date}"
