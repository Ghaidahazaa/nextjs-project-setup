from rest_framework import generics, permissions
from .models import SideEffectLog
from .serializers import SideEffectLogSerializer

class SideEffectLogCreateView(generics.CreateAPIView):
    queryset = SideEffectLog.objects.all()
    serializer_class = SideEffectLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
