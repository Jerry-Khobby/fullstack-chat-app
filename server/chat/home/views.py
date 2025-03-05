from rest_framework import generics, status
from rest_framework.response import Response
from .models import AppUser
from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .serializers import UserSerializer,LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from rest_framework_simplejwt.tokens import RefreshToken

class RegisterUserView(generics.CreateAPIView):
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Save user and get the instance
            refresh = RefreshToken.for_user(user)  # Generate token for user
            access_token = str(refresh.access_token)

            return Response({
                "message": "Signup successful!",
                "access_token": access_token,
                "refresh_token": str(refresh),
            }, status=status.HTTP_201_CREATED)

        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)



    
#I want to write the logic for loggin 
class LoginUserView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]  # Get the authenticated user
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            "message": "Login successful!",
            "access_token": access_token,
            "refresh_token": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
            }
        }, status=status.HTTP_200_OK)





@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_auth(request):
    return Response({"message": "User is authenticated", "user": request.user.email})

#get all the data from all the users 
class UserListView(generics.ListAPIView):
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer