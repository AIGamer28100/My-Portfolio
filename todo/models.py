from django.contrib.auth.models import User
from django.conf import settings
from django.db import models

class Task(models.Model):
    """docstring for Task."""

    STATUS_CHOICES = (
        (0, "Open"),
        (1, "Closed"),
    )
    title = models.CharField(max_length = 64, )
    description = models.CharField(max_length = 500, blank=True )
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length = 10, choices = STATUS_CHOICES, default = 'open')

class UserTask(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete = models.CASCADE)
    tasks = models.ManyToManyField(Task, blank = True, related_name = "tasks", )
