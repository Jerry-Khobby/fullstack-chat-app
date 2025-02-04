from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from .models import AppUser,ChatRoom,Message,MessageAttachment
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = AppUser
        fields = ['id', 'username', 'email', 'password', 'profile_picture', 'date_of_birth', 'gender']

    def create(self, validated_data):
        """Hash password before saving"""
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """Validate user credentials"""
        email = data.get("email")
        password = data.get("password")
        try:
            user = AppUser.objects.get(email=email)
        except AppUser.DoesNotExist:
            raise serializers.ValidationError("User not found.")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password.")

        return {"message": "Login successful"}


#I want to create the serializer for the chatroom and message 
class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = '__all__'
        

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields=["sender"]
    def create(self,validated_data):
        request=self.context.get("request")
        validated_data["sender"]=request.user
        return super().create(validated_data)
        

class MessageAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageAttachment
        fields = '__all__'