from django.contrib import admin

from .models import *

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']

@admin.register(Email)
class EmailAdmin(admin.ModelAdmin):
    list_display = ['id', 'sender', 'Recipients', 'subject', 'timestamp', 'user', 'read', 'archived']
    list_filter = ['read', 'archived', 'timestamp', 'sender', 'user']

    def Recipients(self, obj):
        return ", ".join([str(p) for p in obj.recipients.all()])
