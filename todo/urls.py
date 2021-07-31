from django.urls import path
from . import views

app_name = 'todo'

urlpatterns = [
        # post views
        path('', views.index, name='index'),
        path("login", views.login_view, name="login"),
        path("logout", views.logout_view, name="logout"),
        path("register", views.register, name="register"),
        path("task/<int:id>", views.task, name="task"),
        path("add", views.add, name="add"),
        path("task/<int:id>/status", views.status, name="status"),
        path("task/<int:id>/delete", views.delete, name="delete"),
    ]
