from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    dob = models.DateField(null=True, blank=True)
    chronic_conditions = models.TextField(blank=True)
    goals = models.TextField(blank=True)

class FCMToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fcm_tokens')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"FCMToken for {self.user.username}"
