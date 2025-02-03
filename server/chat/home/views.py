from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from .models import AppUser
from .serializers import AppUserSerializer,LoginSerializer

class RegisterUserView(generics.CreateAPIView):
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer
    def create(self, request, *args, **kwargs):
        password = request.data.get("password")
        if not password:
            return Response({"error": "password field is required."}, status=status.HTTP_400_BAD_REQUEST)
        request.data["password"] = make_password(password)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#I want to write the logic for loggin 
class LoginUserView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        try:
            user =AppUser.objects.get(email=email)
        except AppUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        if not user.check_password(password):
            return Response({"error": "Invalid password."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
    
    
#The next is to start initializing websocket connections for the chat apps 
#I will start by creating a websocket consumer for the chat app