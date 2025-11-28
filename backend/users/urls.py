from django.urls import path
from .views import UserRegisterView, ManageUserView, ChangePasswordView, ChangeUsernameView, GoogleLoginView

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='user_register'),
    path('me/', ManageUserView.as_view(), name='user_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('change-username/', ChangeUsernameView.as_view(), name='change_username'),
    path('google-login/', GoogleLoginView.as_view(), name='google_login'),
]