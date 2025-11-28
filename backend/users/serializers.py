from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password

# 1. KAYIT OLMA SERIALIZER (Register)
class CustomUserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'password2'] 
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Şifreler eşleşmiyor."})
        validate_password(data['password'])
        return data

    def create(self, validated_data):
        validated_data.pop('password2') 
        user = CustomUser.objects.create_user(**validated_data)
        return user

# 2. KULLANICI PROFİLİ SERIALIZER (Profile / Me)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'date_joined')
        read_only_fields = ('id', 'email', 'date_joined')


# 3. PAROLA DEĞİŞTİRME SERIALIZER
class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password2 = serializers.CharField(required=True, write_only=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Mevcut parola yanlış.")
        return value

    def validate(self, data):
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError({"new_password": "Yeni parolalar eşleşmiyor."})
        validate_password(data['new_password'])
        return data

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


# 4. KULLANICI ADI DEĞİŞTİRME SERIALIZER
class ChangeUsernameSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True, write_only=True)
    new_username = serializers.CharField(required=True, max_length=150)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Mevcut parola yanlış.")
        return value

    def validate_new_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Bu kullanıcı adı zaten alınmış.")
        return value

    def save(self):
        user = self.context['request'].user
        user.username = self.validated_data['new_username']
        user.save()
        return user