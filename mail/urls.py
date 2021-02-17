from django.urls import path

from . import views

app_name = 'mail'

urlpatterns = [
    path("", views.index, name="index"),
    path("u/<str:mailbox>", views.index, name="index-page"),
    path("u/<str:mailbox>/<int:id>", views.index, name="index-mail"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("emails", views.compose, name="compose"),
    path("emails/<int:email_id>", views.email, name="email"),
    path("emails/<str:mailbox>", views.mailbox, name="mailbox"),
    path("users", views.usersList, name="userListAPI")
]
