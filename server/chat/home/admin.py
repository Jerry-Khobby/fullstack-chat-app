from django.contrib import admin
from .models import AppUser,ChatRoom,Message,MessageAttachment

class AppUserAdmin(admin.ModelAdmin):
    list_display = ["username", "email", "date_of_birth", "gender"]

# Register your models here.
admin.site.register(AppUser, AppUserAdmin)
admin.site.register(ChatRoom)
admin.site.register(Message)
admin.site.register(MessageAttachment)
