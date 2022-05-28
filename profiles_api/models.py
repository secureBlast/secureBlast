from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
import json
from django.db.models.signals import post_save
from authentication_api.models import NewUser

User = settings.AUTH_USER_MODEL


class Profile(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
    profile_img = models.ImageField(null=True, blank=True)

    def __str__(self):
        return str(self.user)

    def serialize(self):
        return {
            "id": self.user.id,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "user_name": self.user.user_name,
            "email": self.user.email,
        }


def user_did_save(sender, instance, created, *args, **kwargs):
    # Profile.objects.get_or_create(user = instance)
    if created:
        Profile.objects.get_or_create(user=instance)


post_save.connect(user_did_save, sender=User)
