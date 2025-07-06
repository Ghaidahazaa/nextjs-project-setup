from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import AdherenceLog, RefillLog
from .serializers import AdherenceLogSerializer, RefillLogSerializer

class AdherenceLogCreateView(generics.CreateAPIView):
    queryset = AdherenceLog.objects.all()
    serializer_class = AdherenceLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RefillLogCreateView(generics.CreateAPIView):
    queryset = RefillLog.objects.all()
    serializer_class = RefillLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
