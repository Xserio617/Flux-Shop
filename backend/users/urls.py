from django.urls import path
from .views import (
    UserRegisterView, ManageUserView, ChangePasswordView, 
    ChangeUsernameView, GoogleLoginView,
    UserAddressListCreateView, UserAddressDetailView, SetDefaultAddressView
)

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='user_register'),
    path('me/', ManageUserView.as_view(), name='user_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('change-username/', ChangeUsernameView.as_view(), name='change_username'),
    path('google-login/', GoogleLoginView.as_view(), name='google_login'),
    
    # Adres işlemleri
    path('addresses/', UserAddressListCreateView.as_view(), name='address_list_create'),
    path('addresses/<int:pk>/', UserAddressDetailView.as_view(), name='address_detail'),
    path('addresses/<int:pk>/set-default/', SetDefaultAddressView.as_view(), name='set_default_address'),
]