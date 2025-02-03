from django.conf import settings
from django.urls import path
from .views import *
from django.conf.urls.static import static

urlpatterns = [
    #start to define the urls for the cake app 
    path("signup/",RegisterUserView.as_view(),name="create_user"),
    path("login/",LoginUserView.as_view(),name="login_user"),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)