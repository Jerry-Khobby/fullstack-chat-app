from django.contrib import admin
from .models import AppUser

class AppUserAdmin(admin.ModelAdmin):
    list_display = ["username", "email", "date_of_birth", "gender"]

# Register your models here.
admin.site.register(AppUser, AppUserAdmin)