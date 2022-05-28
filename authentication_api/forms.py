from django import forms
from django.contrib.auth.forms import UserCreationForm
from authentication_api.models import NewUser


# setup django authentication form to signup/create an user
class SignUpForm(UserCreationForm):
    first_name = forms.CharField()
    last_name = forms.CharField()
    email = forms.EmailField()
    password1 = forms.PasswordInput()
    password2 = forms.PasswordInput()

    class Meta:
        model = NewUser
        fields = ['first_name', 'last_name', 'email', 'password1', 'password2']

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.user_name = instance.email
        if commit:
            instance.save()
        return instance
