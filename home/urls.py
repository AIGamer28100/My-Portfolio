from django.urls import path
from . import views

app_name = 'home'

urlpatterns = [
        # post views
        path('', views.index, name='index'),
        path('cam/', views.read, name = 'read'),
        path('io/', views.Unread, name = 'Unread'),
    ]
