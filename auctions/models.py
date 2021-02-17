from django.contrib.auth.models import User
from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete = models.CASCADE)
    dp = models.URLField(max_length=1000, default="https://www.dia.org/sites/default/files/No_Img_Avail.jpg")

class Category(models.Model):
    category = models.CharField(max_length = 64, default = None, )
    def __str__(self):
        return f"{self.category}"

class Listing(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=False, editable=True)
    title = models.CharField(max_length = 64, )
    discription = models.CharField(max_length = 200, blank=True, )
    category = models.ManyToManyField(Category, blank = True, related_name = "Category", )
    bid = models.PositiveIntegerField(blank = False, null = False, default = 0, )
    image = models.URLField(max_length=1000, default="https://www.dia.org/sites/default/files/No_Img_Avail.jpg")
    active = models.BooleanField(default = True, )
    created =  models.DateTimeField(auto_now=False, auto_now_add=True,)

    def __str__(self):
        return f"{self.title} : {self.discription} : {self.active} : by {self.user}"


class Bid(models.Model):
    item = models.ForeignKey(Listing, on_delete = models.CASCADE, blank = False, related_name = "Listing", default = None, )
    bidder = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, related_name = "Bidder",  blank = False, default = None, )
    bid = models.PositiveIntegerField(blank = False, default = 0, )

    def __str__(self):
        return f"{self.bid}Rs. on {self.item.title} by {self.bidder.username}"

class Comment(models.Model):
    item = models.ForeignKey(Listing, on_delete = models.CASCADE, blank = False, null = False, related_name = "Comment_on", default = None, )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, related_name = "Profile",  blank = False, default = None, )
    comment = models.CharField(max_length = 500, default = None, )
    created =  models.DateTimeField(auto_now=False, auto_now_add=True,)

    def __str__(self):
        return f"Comment on {self.item.title} by {self.user.username}"

class Wishlist(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, related_name = "User_Wishlist", )
    wishlist = models.ManyToManyField(Listing, blank = True, related_name = "WishList")

    def __str__(self):
        return f"{self.user.username}"
