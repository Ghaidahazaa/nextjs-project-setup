from rest_framework import serializers
from .models import Medication

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ['id', 'user', 'name', 'schedule', 'dose']
        read_only_fields = ['id', 'user']
