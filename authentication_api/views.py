from django.conf import settings
from django.shortcuts import redirect, render
from django.http import JsonResponse
from django.utils.http import is_safe_url
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, logout, authenticate
from .models import NewUser
import base64


from .forms import SignUpForm

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

# Create your views here.


# this function render the user signup view
def signup_view(request, *args, **kwargs):
    return render(request, "signup.html", {})


# this function render the user login view
def login_view(request, *args, **kwargs):
    return render(request, "home.html", {})


# this function render the user logout view
def logout_view(request, *args, **kwargs):
    logout(request)
    return redirect("http://secureblast.pythonanywhere.com")


# this function render the user password reset view
def reset_password_view(request, *args, **kwargs):
    return render(request, "reset_password.html", {})


# this function render the user password reset confirm view
def reset_password_confirm_view(request, *args, **kwargs):
    return render(request, "reset_password_confirm.html", {})


# this function validate the all the details based on user signup
def user_create_view(request, *args, **kwargs):
    form = SignUpForm(request.POST or None)
    next_url = request.POST.get("next") or None
    print(next_url)
    print(request.is_ajax())
    print(request.POST)
    print(form.errors)
    if request.method == "POST":
        if form.is_valid():
            print('form-valid')
            obj = form.save(commit=False)
            obj.save()
            if request.is_ajax():
                # 201 for created items
                return JsonResponse(obj.serialize(), status=201)
            if next_url != None and is_safe_url(next_url, ALLOWED_HOSTS):
                redirect(next_url)
            form = SignUpForm()
        if form.errors:
            if request.is_ajax():
                print('not valid')
                return JsonResponse(form.errors, status=400)
    return render(request, "form.html", {"form": form})


# this function validate the all the details based on user login
def user_login_view(request, *args, **kwargs):
    form = AuthenticationForm(request, data=request.POST or None)
    print(request.user.is_authenticated)
    print(request.user)
    print(request.POST)
    next_url = request.POST.get("next") or None
    print(next_url)
    if form.is_valid():
        user = form.get_user()
        login(request, user)
        if request.is_ajax():
            # 201 for created items
            return JsonResponse(user.serialize(), status=201)
        # need to redirect user profile
        if next_url != None and is_safe_url(next_url, ALLOWED_HOSTS):
            redirect(next_url)
        form = AuthenticationForm()
        print(user)
    if form.errors:
        print(form.errors)
        return JsonResponse(form.errors, status=400)

    return render(request, "form.html", {"form": form})


# this function find and returns the base uid of user
def get_uid(request, *args, **kwargs):
    user_id = request.user.id
    uid = base64.b64encode(str(user_id).encode())
    base_id = uid.decode()
    splits = base_id.split("==")
    id = splits[0]
    print(id)
    return JsonResponse({"uid": id}, status=200)
