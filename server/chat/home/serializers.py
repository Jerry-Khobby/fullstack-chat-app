from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import AppUser

class AppUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = AppUser
        fields = ['id', 'username', 'email', 'password', 'profile_picture', 'date_of_birth', 'gender']
        extra_kwargs = {
            'password': {'write_only': True},  # Ensure password is write-only
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])  # Hash password before saving
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])  # Hash new password
        return super().update(instance, validated_data)