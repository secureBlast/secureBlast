from django.shortcuts import render, redirect
from django.http import JsonResponse, Http404
from .models import Profile
import json
from authentication_api.models import NewUser
from .forms import ProfileUpdateForm


# this function handles the user profile update functionality
def profile_update_view(request, *args, **kwarsg):
    if not request.user.is_authenticated:
        return redirect("/accounts/login?next=/profiles/users/update")
    user = request.user
    profile = user.profile
    profile_data = {
        "first_name": user.first_name,
        "last_name": user.last_name
    }
    form = ProfileUpdateForm()
    if request.POST:
        form = ProfileUpdateForm(request.POST or None,
                                 request.FILES, instance=profile)
        if form.is_valid():
            obj = form.save(commit=False)
            first_name = form.cleaned_data.get("first_name")
            last_name = form.cleaned_data.get("last_name")
            user.first_name = first_name.lower()
            user.last_name = last_name.lower()
            user.save()
            obj.save()
            if first_name:
                return redirect("http://secureblast.pythonanywhere.com/profiles/users/" + user.first_name)
    return render(request, "profile_update_form.html",  {"form": form})


# this function returns the user profile data to a hidden url
# then fetch in front-end to setup profile view
def profile_detail_view(request, first_name, *args, **kwargs):
    user_list = NewUser.objects.filter(first_name=first_name)
    user = user_list.first()
    print(user)
    qs = Profile.objects.filter(user=user)
    if not qs.exists():
        raise Http404
    profile_obj = qs.first()
    # return JsonResponse(profile_obj.serialize(), status =200)
    return render(request, "user_profile.html", profile_obj.serialize())


# this function returns the user data data to a hidden url
# then fetch in front-end
def profile_data_view(request, *args, **kwargs):
    user_list = NewUser.objects.filter(user_name=request.user.user_name)
    user = user_list.first()
    if not user_list.exists():
        raise Http404
    user = user_list.first()
    context = {
        "user": user.serialize(),
    }
    return JsonResponse(context, status=200)


# this function returns the user profile img to a hidden url
# then fetch in front-end to setup profile image
def profile_img_view(request, *args, **kwargs):
    user_list = NewUser.objects.filter(user_name=request.user.user_name)
    user = user_list.first()
    if not user_list.exists():
        raise Http404
    user = user_list.first()
    context = {
        "img_path": json.dumps(str(user.profile.profile_img)),
    }
    return JsonResponse(context, status=200)

