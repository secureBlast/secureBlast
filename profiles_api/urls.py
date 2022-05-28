from django.urls import path
from profiles_api.views import profile_detail_view, profile_data_view, profile_update_view, profile_img_view

urlpatterns = [
    path('<str:first_name>', profile_detail_view),
    path('data/details', profile_data_view),
    path('update/edit', profile_update_view),
    path('data/img', profile_img_view),

]