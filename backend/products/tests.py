"""
Products App API Tests
======================
Bu dosya products uygulamasındaki tüm endpoint'leri test eder.

Testleri çalıştırmak için:
    python manage.py test products
    
Belirli bir test sınıfını çalıştırmak için:
    python manage.py test products.tests.ProductAPITestCase
"""

from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from .models import (
    Product, Category, Campaign, SiteConfiguration, 
    Favorite, Review, PromoBanner, Order, OrderItem
)

User = get_user_model()


class CategoryAPITestCase(APITestCase):
    """Kategori API testleri"""
    
    def setUp(self):
        # Ana kategoriler
        self.elektronik = Category.objects.create(name="Elektronik", slug="elektronik")
        self.giyim = Category.objects.create(name="Giyim", slug="giyim")
        
        # Alt kategoriler
        self.telefon = Category.objects.create(
            name="Telefon", 
            slug="telefon", 
            parent=self.elektronik
        )
        self.bilgisayar = Category.objects.create(
            name="Bilgisayar", 
            slug="bilgisayar", 
            parent=self.elektronik
        )
    
    def test_list_categories(self):
        """Kategorilerin listelenmesi testi"""
        url = reverse('category-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Sadece ana kategoriler dönmeli (parent=NULL olanlar)
        self.assertEqual(len(response.data), 2)
    
    def test_category_children(self):
        """Alt kategorilerin parent içinde görünmesi testi"""
        url = reverse('category-list')
        response = self.client.get(url)
        
        # Elektronik kategorisini bul
        elektronik_data = next(
            (cat for cat in response.data if cat['name'] == 'Elektronik'), 
            None
        )
        
        self.assertIsNotNone(elektronik_data)
        self.assertIn('children', elektronik_data)
        self.assertEqual(len(elektronik_data['children']), 2)


class ProductAPITestCase(APITestCase):
    """Ürün API testleri"""
    
    def setUp(self):
        # Kategoriler
        self.elektronik = Category.objects.create(name="Elektronik", slug="elektronik")
        self.telefon = Category.objects.create(
            name="Telefon", 
            slug="telefon", 
            parent=self.elektronik
        )
        
        # Ürünler
        self.product1 = Product.objects.create(
            name="iPhone 15",
            description="Apple iPhone 15",
            price=Decimal("50000.00"),
            category=self.telefon,
            is_new=True
        )
        
        self.product2 = Product.objects.create(
            name="Samsung S24",
            description="Samsung Galaxy S24",
            price=Decimal("45000.00"),
            category=self.telefon,
            discount_rate=10
        )
        
        self.product3 = Product.objects.create(
            name="Laptop",
            description="Gaming Laptop",
            price=Decimal("75000.00"),
            category=self.elektronik
        )
    
    def test_list_products(self):
        """Tüm ürünlerin listelenmesi testi"""
        url = reverse('product-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
    
    def test_product_detail(self):
        """Ürün detay testi"""
        url = reverse('product-detail', kwargs={'pk': self.product1.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "iPhone 15")
        self.assertEqual(response.data['price'], "50000.00")
    
    def test_filter_by_category(self):
        """Kategoriye göre filtreleme testi"""
        url = reverse('product-list')
        response = self.client.get(url, {'category': self.telefon.id})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Sadece telefonlar
    
    def test_filter_by_category_with_children(self):
        """Alt kategorileriyle birlikte filtreleme testi"""
        url = reverse('product-list')
        response = self.client.get(url, {
            'category': self.elektronik.id,
            'include_children': 'true'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)  # Tüm elektronik ürünler
    
    def test_filter_by_price_range(self):
        """Fiyat aralığına göre filtreleme testi"""
        url = reverse('product-list')
        response = self.client.get(url, {
            'min_price': 40000,
            'max_price': 55000
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # iPhone ve Samsung
    
    def test_search_products(self):
        """Ürün arama testi"""
        url = reverse('product-list')
        response = self.client.get(url, {'search': 'iPhone'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "iPhone 15")
    
    def test_ordering_by_price_asc(self):
        """Fiyata göre artan sıralama testi"""
        url = reverse('product-list')
        response = self.client.get(url, {'ordering': 'price'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        prices = [Decimal(p['price']) for p in response.data]
        self.assertEqual(prices, sorted(prices))
    
    def test_ordering_by_price_desc(self):
        """Fiyata göre azalan sıralama testi"""
        url = reverse('product-list')
        response = self.client.get(url, {'ordering': '-price'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        prices = [Decimal(p['price']) for p in response.data]
        self.assertEqual(prices, sorted(prices, reverse=True))
    
    def test_nonexistent_product(self):
        """Var olmayan ürün testi"""
        url = reverse('product-detail', kwargs={'pk': 99999})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CampaignAPITestCase(APITestCase):
    """Kampanya API testleri"""
    
    def setUp(self):
        self.campaign1 = Campaign.objects.create(
            title="Yaz İndirimi",
            is_active=True
        )
        self.campaign2 = Campaign.objects.create(
            title="Kış Kampanyası",
            is_active=True
        )
        self.campaign_inactive = Campaign.objects.create(
            title="Eski Kampanya",
            is_active=False
        )
    
    def test_list_campaigns(self):
        """Aktif kampanyaların listelenmesi testi"""
        url = reverse('campaign-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Sadece aktif olanlar
    
    def test_inactive_campaigns_not_shown(self):
        """İnaktif kampanyaların gösterilmemesi testi"""
        url = reverse('campaign-list')
        response = self.client.get(url)
        
        titles = [c['title'] for c in response.data]
        self.assertNotIn("Eski Kampanya", titles)


class SiteConfigurationAPITestCase(APITestCase):
    """Site ayarları API testleri"""
    
    def setUp(self):
        self.config = SiteConfiguration.objects.create(
            is_active=True,
            topbar_link="https://example.com"
        )
    
    def test_get_site_settings(self):
        """Site ayarlarının alınması testi"""
        url = reverse('site-settings')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_active'])
        self.assertEqual(response.data['topbar_link'], "https://example.com")


class FavoriteAPITestCase(APITestCase):
    """Favori API testleri"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@test.com',
            username='testuser',
            password='testpass123'
        )
        
        self.product = Product.objects.create(
            name="Test Ürün",
            price=Decimal("1000.00")
        )
        
        self.client = APIClient()
    
    def test_add_favorite_authenticated(self):
        """Giriş yapmış kullanıcının favori eklemesi testi"""
        self.client.force_authenticate(user=self.user)
        
        url = reverse('favorite-list-create')
        response = self.client.post(url, {'product': self.product.id})
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Favorite.objects.count(), 1)
        self.assertEqual(Favorite.objects.first().user, self.user)
    
    def test_add_favorite_unauthenticated(self):
        """Giriş yapmamış kullanıcının favori eklememesi testi"""
        url = reverse('favorite-list-create')
        response = self.client.post(url, {'product': self.product.id})
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_list_favorites(self):
        """Kullanıcının favorilerini listeleme testi"""
        self.client.force_authenticate(user=self.user)
        
        Favorite.objects.create(user=self.user, product=self.product)
        
        url = reverse('favorite-list-create')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_delete_favorite(self):
        """Favori silme testi"""
        self.client.force_authenticate(user=self.user)
        
        favorite = Favorite.objects.create(user=self.user, product=self.product)
        
        url = reverse('favorite-delete', kwargs={'pk': favorite.pk})
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Favorite.objects.count(), 0)
    
    def test_duplicate_favorite(self):
        """Aynı ürünü tekrar favoriye ekleme testi"""
        self.client.force_authenticate(user=self.user)
        
        Favorite.objects.create(user=self.user, product=self.product)
        
        url = reverse('favorite-list-create')
        response = self.client.post(url, {'product': self.product.id})
        
        # unique_together kısıtlaması nedeniyle hata vermeli
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ReviewAPITestCase(APITestCase):
    """Yorum API testleri"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@test.com',
            username='testuser',
            password='testpass123'
        )
        
        self.product = Product.objects.create(
            name="Test Ürün",
            price=Decimal("1000.00")
        )
        
        self.client = APIClient()
    
    def test_add_review_authenticated(self):
        """Giriş yapmış kullanıcının yorum eklemesi testi"""
        self.client.force_authenticate(user=self.user)
        
        url = reverse('product-reviews', kwargs={'product_id': self.product.id})
        response = self.client.post(url, {
            'rating': 5,
            'comment': 'Harika bir ürün!'
        })
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)
        self.assertEqual(Review.objects.first().rating, 5)
    
    def test_add_review_unauthenticated(self):
        """Giriş yapmamış kullanıcının yorum eklememesi testi"""
        url = reverse('product-reviews', kwargs={'product_id': self.product.id})
        response = self.client.post(url, {
            'rating': 5,
            'comment': 'Test yorum'
        })
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_list_reviews_public(self):
        """Yorumların herkese açık listelenmesi testi"""
        Review.objects.create(
            user=self.user,
            product=self.product,
            rating=4,
            comment="İyi ürün"
        )
        
        url = reverse('product-reviews', kwargs={'product_id': self.product.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_review_affects_average_rating(self):
        """Yorumların ortalama puanı etkilemesi testi"""
        Review.objects.create(user=self.user, product=self.product, rating=5, comment="Mükemmel")
        
        user2 = User.objects.create_user(
            email='test2@test.com',
            username='testuser2',
            password='testpass123'
        )
        Review.objects.create(user=user2, product=self.product, rating=3, comment="İdare eder")
        
        url = reverse('product-detail', kwargs={'pk': self.product.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['average_rating'], 4.0)  # (5+3)/2 = 4


class PromoBannerAPITestCase(APITestCase):
    """Promo Banner API testleri"""
    
    def setUp(self):
        self.banner1 = PromoBanner.objects.create(
            title="Banner 1",
            is_active=True,
            order=1
        )
        self.banner2 = PromoBanner.objects.create(
            title="Banner 2",
            is_active=True,
            order=2
        )
        self.banner_inactive = PromoBanner.objects.create(
            title="Inactive Banner",
            is_active=False,
            order=3
        )
    
    def test_list_promo_banners(self):
        """Aktif bannerların listelenmesi testi"""
        url = reverse('promo-banner-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Sadece aktif olanlar
    
    def test_banner_ordering(self):
        """Bannerların sıralanması testi"""
        url = reverse('promo-banner-list')
        response = self.client.get(url)
        
        orders = [b['order'] for b in response.data]
        self.assertEqual(orders, sorted(orders))


class OrderAPITestCase(APITestCase):
    """Sipariş API testleri"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@test.com',
            username='testuser',
            password='testpass123'
        )
        
        self.other_user = User.objects.create_user(
            email='other@test.com',
            username='otheruser',
            password='testpass123'
        )
        
        self.product = Product.objects.create(
            name="Test Ürün",
            price=Decimal("1000.00")
        )
        
        self.client = APIClient()
    
    def test_create_order_authenticated(self):
        """Giriş yapmış kullanıcının sipariş oluşturması testi"""
        self.client.force_authenticate(user=self.user)
        
        url = reverse('order-list-create')
        order_data = {
            'order_number': 'ORD-12345',
            'total_price': '2000.00',
            'customer_name': 'Test Müşteri',
            'delivery_address': 'Test Adres, Ankara',
            'items_data': [
                {
                    'product': self.product.id,
                    'quantity': 2,
                    'price': '1000.00'
                }
            ]
        }
        response = self.client.post(url, order_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(OrderItem.objects.count(), 1)
    
    def test_create_order_unauthenticated(self):
        """Giriş yapmamış kullanıcının sipariş oluşturamaması testi"""
        url = reverse('order-list-create')
        order_data = {
            'order_number': 'ORD-12345',
            'total_price': '1000.00',
            'customer_name': 'Test',
            'delivery_address': 'Test Adres'
        }
        response = self.client.post(url, order_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_list_own_orders(self):
        """Kullanıcının kendi siparişlerini listeleme testi"""
        self.client.force_authenticate(user=self.user)
        
        Order.objects.create(
            user=self.user,
            order_number='ORD-111',
            total_price=Decimal('1000.00'),
            customer_name='Test',
            delivery_address='Adres'
        )
        
        # Başka kullanıcının siparişi
        Order.objects.create(
            user=self.other_user,
            order_number='ORD-222',
            total_price=Decimal('2000.00'),
            customer_name='Other',
            delivery_address='Other Adres'
        )
        
        url = reverse('order-list-create')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Sadece kendi siparişi
    
    def test_order_detail(self):
        """Sipariş detayı testi"""
        self.client.force_authenticate(user=self.user)
        
        order = Order.objects.create(
            user=self.user,
            order_number='ORD-111',
            total_price=Decimal('1000.00'),
            customer_name='Test Müşteri',
            delivery_address='Test Adres'
        )
        
        url = reverse('order-detail', kwargs={'pk': order.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['order_number'], 'ORD-111')
    
    def test_cannot_access_other_users_order(self):
        """Başka kullanıcının siparişine erişememek testi"""
        self.client.force_authenticate(user=self.user)
        
        other_order = Order.objects.create(
            user=self.other_user,
            order_number='ORD-222',
            total_price=Decimal('2000.00'),
            customer_name='Other',
            delivery_address='Other Adres'
        )
        
        url = reverse('order-detail', kwargs={'pk': other_order.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_order_status_update(self):
        """Sipariş durumu güncelleme testi"""
        self.client.force_authenticate(user=self.user)
        
        order = Order.objects.create(
            user=self.user,
            order_number='ORD-111',
            total_price=Decimal('1000.00'),
            customer_name='Test',
            delivery_address='Adres',
            status='pending'
        )
        
        url = reverse('order-detail', kwargs={'pk': order.pk})
        response = self.client.patch(url, {'status': 'shipped'}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, 'shipped')


class ProductWithReviewsTestCase(APITestCase):
    """Ürün ve yorum entegrasyon testleri"""
    
    def setUp(self):
        self.user1 = User.objects.create_user(
            email='user1@test.com',
            username='user1',
            password='testpass123'
        )
        self.user2 = User.objects.create_user(
            email='user2@test.com',
            username='user2',
            password='testpass123'
        )
        
        self.product = Product.objects.create(
            name="Test Ürün",
            price=Decimal("1000.00")
        )
    
    def test_product_average_rating_calculation(self):
        """Ürün ortalama puan hesaplaması testi"""
        Review.objects.create(user=self.user1, product=self.product, rating=5, comment="Harika")
        Review.objects.create(user=self.user2, product=self.product, rating=4, comment="İyi")
        
        url = reverse('product-detail', kwargs={'pk': self.product.pk})
        response = self.client.get(url)
        
        # Ortalama: (5+4)/2 = 4.5
        self.assertEqual(response.data['average_rating'], 4.5)
    
    def test_product_with_no_reviews(self):
        """Yorumsuz ürün ortalama puanı testi"""
        url = reverse('product-detail', kwargs={'pk': self.product.pk})
        response = self.client.get(url)
        
        self.assertIsNone(response.data['average_rating'])
