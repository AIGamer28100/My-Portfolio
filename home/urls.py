from django.urls import path
from . import views

app_name = 'home'

urlpatterns = [
        # post views
        path('', views.index, name='index'),
        path('cam/', views.read, name = 'SDES'),
        path('io/', views.Unread, name = 'inputData'),
        path('webcam_feed', views.feed_cam, name = "feed_cam"),
    ]
