from rest_framework import serializers
from django.contrib.auth import get_user_model 
from django.contrib.auth import authenticate
from .models import AppUser,ChatRoom,Message,MessageAttachment
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = AppUser
        fields = ['id', 'username', 'email', 'password', 'profile_picture', 'date_of_birth', 'gender']

    def create(self, validated_data):
        """Use create_user to ensure password is hashed properly"""
        return AppUser.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")
        User = get_user_model()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        if not user.check_password(password):  # Compare hashed passwords
            raise serializers.ValidationError("Invalid credentials")

        return {"email": user.email, "password": password}


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