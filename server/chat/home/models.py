from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import EmailValidator

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
    
    def __str__(self):
        return self.username