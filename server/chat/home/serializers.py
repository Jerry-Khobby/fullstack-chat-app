from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import AppUser

class AppUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = AppUser
        fields = ['id', 'username', 'email', 'password', 'profile_picture', 'date_of_birth', 'gender']

    def create(self, validated_data):
        """Hash password and create the user."""
        validated_data["password"] = make_password(validated_data["password"])  # Hash password
        return super().create(validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
