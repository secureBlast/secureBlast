from django.urls import path
from django.contrib.auth import views as auth_views
from authentication_api.views import signup_view, login_view, user_create_view, user_login_view, reset_password_view, reset_password_confirm_view, logout_view, get_uid

# matching url for user authentication view/funtionalities
urlpatterns = [
    path('register', signup_view),
    path('create', user_create_view),
    path('auth', user_login_view),
    path('login', login_view),
    path('reset', reset_password_view),
    path('reset_confirm', reset_password_confirm_view, name="reset_confirm_view"),
    path('logout', logout_view),
    path('user/base/uid', get_uid),

    path('reset_password/', auth_views.PasswordResetView.as_view(),
         name="reset_password"),
    path('reset_password_sent/', auth_views.PasswordChangeDoneView.as_view(),
         name="password_reset_done"),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name="reset_form.html"),
         name="password_reset_confirm"),
    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(),
         name="password_reset_complete"),

]
