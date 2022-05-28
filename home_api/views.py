from django.shortcuts import render


# this funtion render the home view
def home_view(request, *args, **kwargs):
    return render(request, "home.html", {})
