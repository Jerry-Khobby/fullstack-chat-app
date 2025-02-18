from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from .models import AppUser
from .serializers import UserSerializer,LoginSerializer

class RegisterUserView(generics.CreateAPIView):
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Signup successful!"},status=status.HTTP_201_CREATED)
        return Response({"error": serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    
#I want to write the logic for loggin 
class LoginUserView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


#get all the data from all the users 
class UserListView(generics.ListAPIView):
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer