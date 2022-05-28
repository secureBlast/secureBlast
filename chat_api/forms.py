from django.conf import settings
from django import forms
from .models import Room, Message


User = settings.AUTH_USER_MODEL


class RoomCreationForm(forms.ModelForm):
    room_name = forms.CharField(required=True)
    code = forms.CharField(required=True)

    class Meta:
        model = Room
        fields = ['room_name', 'code']


class MessageForm(forms.ModelForm):
    value = forms.CharField(required=True)

    class Meta:
        model = Message
        fields = ['value']


class RoomJoinForm(forms.Form):
    room_name = forms.CharField(required=True)
    code = forms.CharField(required=True)

