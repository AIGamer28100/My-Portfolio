from django.urls import path
from . import views

app_name = 'home'

urlpatterns = [
        # post views
        path('v1/', views.v1, name='v1'),
        path('', views.v2, name='v2'),
    ]
