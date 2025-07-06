from rest_framework import generics, permissions, status
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User, FCMToken
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

class RegisterFCMTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"detail": "Token is required."}, status=status.HTTP_400_BAD_REQUEST)
        fcm_token, created = FCMToken.objects.get_or_create(user=request.user, token=token)
        if created:
            return Response({"detail": "Token registered."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"detail": "Token already registered."}, status=status.HTTP_200_OK)
