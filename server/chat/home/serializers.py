from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import AppUser

class AppUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)  # Explicitly declare confirm_password

    class Meta:
        model = AppUser
        fields = ['id', 'username', 'email', 'password', 'confirm_password', 'profile_picture', 'date_of_birth', 'gender']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        """Ensure password and confirm_password match."""
        password = data.get("password")
        confirm_password = data.get("confirm_password")  # Remove confirm_password before saving

        if password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        
        data.pop("confirm_password")
        return data  # Only return valid fields

    def create(self, validated_data):
        """Hash password and create the user."""
        validated_data["password"] = make_password(validated_data["password"])  # Hash password
        return super().create(validated_data)
