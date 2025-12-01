from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomUserRegisterSerializer, UserSerializer, ChangePasswordSerializer, ChangeUsernameSerializer, UserAddressSerializer
from .models import CustomUser, UserAddress
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings


class GoogleLoginView(APIView):
    """Google OAuth ile giriş"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        token = request.data.get('credential')
        
        if not token:
            return Response({'error': 'Token gerekli'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Google Client ID - settings'den al
            GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID
            
            # Token'ı doğrula
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                GOOGLE_CLIENT_ID
            )
            
            # Email ve kullanıcı bilgilerini al
            email = idinfo.get('email')
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            google_id = idinfo.get('sub')
            
            if not email:
                return Response({'error': 'Email alınamadı'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Kullanıcıyı bul veya oluştur
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': first_name,
                    'last_name': last_name,
                    'is_active': True,
                }
            )
            
            # Kullanıcı varsa bilgilerini güncelle
            if not created:
                if first_name and not user.first_name:
                    user.first_name = first_name
                if last_name and not user.last_name:
                    user.last_name = last_name
                user.save()
            
            # JWT token oluştur
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'created': created  # Yeni kullanıcı mı?
            }, status=status.HTTP_200_OK)
            
        except ValueError as e:
            return Response({'error': f'Geçersiz token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'Bir hata oluştu: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserRegisterView(generics.CreateAPIView):
    # Bu view, sadece POST (oluşturma) işlemi yapacak
    permission_classes = [permissions.AllowAny] # Herkese açık (Login gerektirmez)
    serializer_class = CustomUserRegisterSerializer
    
    # Kullanıcı kaydı başarılı olursa, 201 Created döndür
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Kullanıcı kaydedildikten sonra başarılı bir cevap döndür
        return Response({
            "message": "Kullanıcı başarıyla oluşturuldu.",
            "email": user.email
        }, status=status.HTTP_201_CREATED)


# 2. PROFİL VIEW'I (Hata veren eksik parça buydu!)
class ManageUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated] # Sadece giriş yapanlar

    def get_object(self):
        return self.request.user


# 3. PAROLA DEĞİŞTİRME VIEW
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Parola başarıyla değiştirildi."}, status=status.HTTP_200_OK)


# 4. KULLANICI ADI DEĞİŞTİRME VIEW
class ChangeUsernameView(generics.UpdateAPIView):
    serializer_class = ChangeUsernameSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Kullanıcı adı başarıyla değiştirildi.", "username": request.user.username}, status=status.HTTP_200_OK)        


# 5. KULLANICI ADRESLERİ VİEW (CRUD İşlemleri)
class UserAddressListCreateView(generics.ListCreateAPIView):
    """Kullanıcının adreslerini listele ve yeni adres ekle"""
    serializer_class = UserAddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserAddress.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            "message": "Adres başarıyla eklendi.",
            "address": serializer.data
        }, status=status.HTTP_201_CREATED)


class UserAddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Tek bir adresi görüntüle, güncelle veya sil"""
    serializer_class = UserAddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserAddress.objects.filter(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            "message": "Adres başarıyla güncellendi.",
            "address": serializer.data
        })
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Adres başarıyla silindi."}, status=status.HTTP_200_OK)


class SetDefaultAddressView(APIView):
    """Bir adresi varsayılan olarak ayarla"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            address = UserAddress.objects.get(pk=pk, user=request.user)
            address.is_default = True
            address.save()
            return Response({"message": "Varsayılan adres güncellendi."}, status=status.HTTP_200_OK)
        except UserAddress.DoesNotExist:
            return Response({"error": "Adres bulunamadı."}, status=status.HTTP_404_NOT_FOUND)        