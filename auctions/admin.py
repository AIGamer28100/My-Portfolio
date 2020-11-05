from django.contrib import admin

# Register your models here.

from .models import *

class UserAdmin(admin.ModelAdmin):
    filter_horizontal = ("user_permissions",)

class ListingAdmin(admin.ModelAdmin):
    list_display = ("title",)
    filter_horizontal = ("category",)

class WishlistAdmin(admin.ModelAdmin):
    filter_horizontal = ("wishlist",)

class CategoryAdmin(admin.ModelAdmin):
    list_display = ("category",)

admin.site.register(User, UserAdmin)
admin.site.register(Listing, ListingAdmin)
admin.site.register(Bid)
admin.site.register(Comment)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Wishlist, WishlistAdmin)
