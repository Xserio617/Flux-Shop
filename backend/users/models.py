from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # Bu model, Django'nun varsayılan kullanıcı modelinin tüm özelliklerini alır.
    # Biz sadece e-posta adresini zorunlu ve benzersiz (unique) hale getiriyoruz.

    email = models.EmailField(unique=True)
    
    # Kullanıcı adı (username) zorunluluğunu kaldırıp, email ile login olmak için
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] # 'username' alanını koruyoruz ancak login için kullanmayacağız.

    def __str__(self):
        return self.email


class UserAddress(models.Model):
    """Kullanıcının kayıtlı adresleri (Evim, Okulum, İşim vb.)"""
    
    user = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        related_name='addresses',
        verbose_name="Kullanıcı"
    )
    title = models.CharField(
        max_length=50, 
        verbose_name="Adres Başlığı",
        help_text="Örn: Evim, Okulum, İş Yerim"
    )
    full_name = models.CharField(
        max_length=100, 
        verbose_name="Alıcı Adı Soyadı"
    )
    phone = models.CharField(
        max_length=20, 
        verbose_name="Telefon Numarası"
    )
    city = models.CharField(
        max_length=50, 
        verbose_name="İl"
    )
    district = models.CharField(
        max_length=50, 
        verbose_name="İlçe"
    )
    neighborhood = models.CharField(
        max_length=100, 
        blank=True, 
        null=True,
        verbose_name="Mahalle"
    )
    address_line = models.TextField(
        verbose_name="Açık Adres",
        help_text="Sokak, bina no, daire no vb."
    )
    postal_code = models.CharField(
        max_length=10, 
        blank=True, 
        null=True,
        verbose_name="Posta Kodu"
    )
    is_default = models.BooleanField(
        default=False, 
        verbose_name="Varsayılan Adres"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Kullanıcı Adresi"
        verbose_name_plural = "Kullanıcı Adresleri"
        ordering = ['-is_default', '-updated_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.title}"
    
    def save(self, *args, **kwargs):
        # Eğer bu adres varsayılan yapılıyorsa, diğerlerini varsayılan olmaktan çıkar
        if self.is_default:
            UserAddress.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)
    
    def get_full_address(self):
        """Tam adresi tek satırda döndür"""
        parts = [self.address_line]
        if self.neighborhood:
            parts.append(self.neighborhood)
        parts.extend([self.district, self.city])
        if self.postal_code:
            parts.append(self.postal_code)
        return ", ".join(parts)