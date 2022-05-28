from django.conf import settings
from django import forms
from .models import Profile


User = settings.AUTH_USER_MODEL

class ProfileUpdateForm(forms.ModelForm):
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=True)
    class Meta:
        model = Profile
        fields = ['profile_img']