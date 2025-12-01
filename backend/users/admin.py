from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserAddress


# CustomUser Admin
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_staff', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)


# UserAddress Admin
@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'full_name', 'city', 'district', 'is_default', 'created_at')
    list_filter = ('is_default', 'city')
    search_fields = ('title', 'user__email', 'full_name', 'city', 'district', 'address_line')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Kullanıcı', {
            'fields': ('user', 'title', 'is_default')
        }),
        ('Alıcı Bilgileri', {
            'fields': ('full_name', 'phone')
        }),
        ('Adres Detayları', {
            'fields': ('city', 'district', 'neighborhood', 'address_line', 'postal_code')
        }),
        ('Tarihler', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )