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