import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom, Message
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handles new WebSocket connections"""
        self.chatroom_id = self.scope["url_route"]["kwargs"]["chatroom_id"]
        self.room_group_name = f"chat_{self.chatroom_id}"

        # Join the chat room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        """Handles WebSocket disconnection"""
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """Handles receiving messages from WebSocket"""
        data = json.loads(text_data)
        sender_id = data["sender_id"]
        text_content = data["text_content"]

        # Validate user and chatroom
        sender = await self.get_user(sender_id)
        chatroom = await self.get_chatroom(self.chatroom_id)

        if sender and chatroom:
            # Save message to database
            message = await self.save_message(sender, chatroom, text_content)

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "sender": sender.username,
                    "text_content": message.text_content,
                    "timestamp": str(message.timestamp),
                },
            )

    async def chat_message(self, event):
        """Sends new messages to all users in the chatroom"""
        await self.send(text_data=json.dumps(event))

    @staticmethod
    async def get_user(user_id):
        """Fetch user from database"""
        return await User.objects.get(id=user_id)

    @staticmethod
    async def get_chatroom(chatroom_id):
        """Fetch chatroom from database"""
        return await ChatRoom.objects.get(id=chatroom_id)

    @staticmethod
    async def save_message(sender, chatroom, text_content):
        """Save message to database"""
        return await Message.objects.create(
            sender=sender,
            chatroom=chatroom,
            text_content=text_content,
        )
