from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import EmailValidator
from django.contrib.auth import get_user_model



User=get_user_model()
class AppUser(AbstractUser):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    username=models.CharField(max_length=255,unique=False,blank=False)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    email = models.EmailField(unique=True,validators=[EmailValidator()],blank=False)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    
    # Add unique related_name attributes to avoid clashes
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="appuser_groups",  # Unique related_name
        related_query_name="appuser",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="appuser_permissions",  # Unique related_name
        related_query_name="appuser",
    )
    USERNAME_FIELD = 'email' #this tells Django to use email for authentications. 
    def __str__(self):
        return self.username
    
    
    
# want to dedicate today to creating the model that handles the Message 
class ChatRoom(models.Model):
    name= models.CharField(max_length=255)
    user = models.ManyToManyField(User,related_name="chatrooms")
    
    
    def __str__(self):
        return self.name


class Message(models.Model):
    MESSAGE_TYPES = [
        ("text", "Text"),
        ("image", "Image"),
        ("document", "Document"),
        ("audio", "Audio"),
        ("video", "Video"),
        ("mixed", "Mixed"),  # To indicate text + multiple media
    ]

    chatroom = models.ForeignKey(ChatRoom, related_name="messages", on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES, default="text")
    text_content = models.TextField(blank=True, null=True)  # Caption for media or standalone text
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username}: {self.get_message_preview()}"

    def get_message_preview(self):
        """Returns a short preview of the message"""
        if self.text_content:
            return self.text_content[:30]  # Show first 30 characters
        return f"[{self.message_type} message]"

class MessageAttachment(models.Model):
    message = models.ForeignKey(Message, related_name="attachments", on_delete=models.CASCADE)
    file = models.FileField(upload_to="chat_files/")
    file_type = models.CharField(
        max_length=10,
        choices=[
            ("image", "Image"),
            ("video", "Video"),
            ("audio", "Audio"),
            ("document", "Document"),
        ]
    )

    def __str__(self):
        return f"{self.file_type} attachment for {self.message.sender.username}"