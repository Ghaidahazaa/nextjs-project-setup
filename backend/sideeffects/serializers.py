from rest_framework import serializers
from .models import SideEffectLog

class SideEffectLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SideEffectLog
        fields = ['id', 'user', 'medication', 'symptom', 'severity', 'date', 'notes', 'image']
        read_only_fields = ['id', 'user', 'date']
