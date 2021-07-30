from django.urls import path
from . import views

app_name = 'todo'

urlpatterns = [
        # post views
        path('', views.index, name='index'),
        path("login", views.login_view, name="login"),
        path("logout", views.logout_view, name="logout"),
        path("register", views.register, name="register"),
        path("add", views.add, name="add"),
        path("<int:id>/open", views.open, name="open"),
        path("<int:id>/close", views.close, name="close"),
        path("<int:id>/delete", views.delete, name="delete"),
    ]
