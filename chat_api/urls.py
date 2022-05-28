from django.urls import path
from chat_api.views import room_create_view, message_create_view, room_list_view, room_join_view, message_list_view

# match urls for home_api
urlpatterns = [
    path('create-room', room_create_view),
    path('create-message/<str:room_code>', message_create_view),
    path('rooms', room_list_view),
    path('messages', message_list_view),
     path('join-room', room_join_view),
]
