from django.contrib import admin

# Register your models here.

from .models import *

class UserTaskAdmin(admin.ModelAdmin):
    list_display = ("user",)

class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "description", "timestamp", "status")
    list_editable = ('status',)
    list_filter = ("status", "timestamp")

admin.site.register(UserTask, UserTaskAdmin)
admin.site.register(Task, TaskAdmin)
