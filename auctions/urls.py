from django.urls import path

from . import views

app_name = 'auctions'

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("Users/<int:UserId>", views.Profile, name="Profile"),
    path("Users/<int:UserId>/edit", views.editprofile,  name="Profileedit"),
    path("Categories", views.Categories, name="Categories"),
    path("Categories/<int:CategoryList>", views.CategoryListing, name="CategoryListing"),
    path("CreateListing", views.createlisting, name="createlisting"),
    path("<str:title>?id=<int:id>", views.Item, name="Item"),
    path("<str:title>/edit", views.editlisting, name="editlist"),
    path("Watchlist", views.wish, name="Wishs"),
    path("removewishlist", views.removewishlist, name="removewishlist"),
    path("addwishlist", views.addwishlist, name="addwishlist"),
]

handler404= views.redirect
