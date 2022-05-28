from django.urls import path
from home_api.views import home_view

# match urls for home_api
urlpatterns = [
    path('', home_view),
]
