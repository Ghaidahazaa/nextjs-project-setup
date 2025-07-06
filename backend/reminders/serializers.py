from rest_framework import serializers
from .models import AdherenceLog, RefillLog

class AdherenceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdherenceLog
        fields = ['id', 'user', 'medication', 'datetime', 'status', 'reason']
        read_only_fields = ['id', 'user', 'datetime']

class RefillLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefillLog
        fields = ['id', 'user', 'medication', 'date']
        read_only_fields = ['id', 'user', 'date']
