from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
import json
from datetime import datetime
from django.db.models.signals import post_save
from authentication_api.models import NewUser

User = settings.AUTH_USER_MODEL


class Room(models.Model):

    owner = models.ManyToManyField(User, null=True)
    room_name = models.CharField(max_length=20, unique=True)
    code = models.CharField(unique=True, max_length=6)
    is_active = models.BooleanField(default=False)

    def serialize(self, user):
        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "user_name": user.user_name,
            "email": user.email,
            "room_name": self.room_name,
            "code": self.code,
            "active": self.is_active,
        }


class Message(models.Model):
    value = models.CharField(max_length=1000)
    val1 = models.CharField(max_length=1000)
    val2 = models.CharField(max_length=1000)
    val3 = models.CharField(max_length=1000)
    date = models.DateTimeField(default=datetime.now, blank=True)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user)

    def serialize(self):
        return {
            "id": self.user.id,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "user_name": self.user.user_name,
            "email": self.user.email,
            "date": self.date,
            "message": self.value,
            "val1": self.val1,
            "val2": self.val2,
            "val3": self.val3,
            "room": self.room.serialize(self.user),
        }

class Active(models.Model):
    room = models.ForeignKey(Room, null=True, on_delete=models.CASCADE)
    active_users = models.ForeignKey(User, null=True, on_delete=models.CASCADE)

