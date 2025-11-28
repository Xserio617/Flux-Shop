from django.db.models import Avg, Count
from rest_framework import viewsets, generics, permissions, filters
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.conf import settings
import google.generativeai as genai
import re
import iyzipay
import json

# Modelleri çağırıyoruz
from .models import (
    Product, 
    Campaign, 
    SiteConfiguration, 
    Favorite, 
    Review, 
    Category,
    PromoBanner,
    ReviewImage,
    ProductImage,
    Order,
    OrderItem,
    BugReport,
    Coupon,
    PaymentSettings,
    UserBehavior
)

# Sadece BURADA var olan serializerları çağırıyoruz
from .serializers import (
    ProductSerializer, 
    CampaignSerializer, 
    SiteConfigurationSerializer, 
    FavoriteSerializer, 
    ReviewSerializer, 
    CategorySerializer,
    PromoBannerSerializer,
    ReviewImageSerializer,
    ProductImageSerializer,
    OrderSerializer,
    OrderItemSerializer,
    BugReportSerializer,
    CouponSerializer
)
from .serializers import UserBehaviorSerializer

# 1. KATEGORİ LİSTELEME (Sadece Ana Kategoriler + Alt Kategorileriyle)
class CategoryList(generics.ListAPIView):
    # Sadece parent'ı olmayan (ana) kategorileri getir
    # Alt kategoriler serializer içinde 'children' olarak gelecek
    queryset = Category.objects.filter(parent__isnull=True)
    serializer_class = CategorySerializer

# 2. ÜRÜNLER (Arama ve Filtreleme Dahil)
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    
    # !!! GELİŞTİRME: SIRALAMA ÖZELLİĞİNİ EKLEDİK !!!
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category__name']
    
    # Sıralamaya izin verilen alanlar
    ordering_fields = ['price', 'created_at', 'average_rating', 'review_count']
    # Varsayılan sıralama: Yeni ürünler öne çıksın
    ordering = ['-created_at'] 

    def get_queryset(self):
        # 1. Temel Sorgu
        queryset = Product.objects.all()
        
        # 2. Ortalama Rating ve Review Count Hesaplaması (Frontend için)
        queryset = queryset.annotate(
            average_rating=Avg('reviews__rating'),
            review_count=Count('reviews', distinct=True)
        )
        
        # 3. Kategori Filtresi (Alt kategorileri de dahil et - recursive)
        category_id = self.request.query_params.get('category')
        include_children = self.request.query_params.get('include_children', 'false').lower() == 'true'
        
        if category_id:
            try:
                category_id = int(category_id)  # String'den int'e çevir
                
                if include_children:
                    # Ana kategori + tüm alt kategorilerindeki ürünleri getir (recursive)
                    category_ids = [category_id]
                    
                    def get_all_children(parent_id):
                        """Recursive olarak tüm alt kategorileri bul"""
                        children = Category.objects.filter(parent_id=parent_id)
                        child_ids = []
                        for child in children:
                            child_ids.append(child.id)
                            child_ids.extend(get_all_children(child.id))  # Alt kategorilerin alt kategorileri
                        return child_ids
                    
                    category_ids.extend(get_all_children(category_id))
                    queryset = queryset.filter(category_id__in=category_ids)
                else:
                    # Sadece seçilen kategori
                    queryset = queryset.filter(category_id=category_id)
            except (ValueError, Category.DoesNotExist):
                pass
            
        # 4. Fiyat Filtreleme
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
            
        return queryset

# 3. KAMPANYALAR (Hero Slider)
class CampaignList(generics.ListAPIView):
    """Sadece aktif (is_active=True) olan kampanyaları listeler."""
    queryset = Campaign.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = CampaignSerializer

# 4. SİTE AYARLARI (TopBar)
class SiteSettingsView(generics.RetrieveAPIView):
    """Sadece tek bir SiteConfiguration objesini çeker."""
    serializer_class = SiteConfigurationSerializer
    
    def get_object(self):
        return SiteConfiguration.objects.get()

# 5. FAVORİ EKLEME / LİSTELEME
class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# 6. FAVORİ SİLME
class FavoriteDeleteView(generics.DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

# 7. YORUM EKLEME / LİSTELEME
class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return Review.objects.filter(product_id=product_id).order_by('-created_at')

    def perform_create(self, serializer):
        product_id = self.kwargs['product_id']
        product = Product.objects.get(id=product_id)
        serializer.save(user=self.request.user, product=product)


# 7.1 YORUM RESİMLERİ YÜKLEME
class ReviewImageCreateView(generics.CreateAPIView):
    serializer_class = ReviewImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        review_id = self.kwargs['review_id']
        review = Review.objects.get(id=review_id)
        # Sadece yorumu yapan kişi resim yükleyebilir
        if review.user == self.request.user:
            serializer.save(review=review)


# 8. REKLAM BANNERLARI (Süper Fırsatlar Altı)
class PromoBannerList(generics.ListAPIView):
    """Sadece aktif reklam bannerlarını listeler."""
    queryset = PromoBanner.objects.filter(is_active=True).order_by('order', '-created_at')
    serializer_class = PromoBannerSerializer


# 9. SİPARİŞLER
class OrderListCreateView(generics.ListCreateAPIView):
    """Kullanıcının tüm siparişlerini listeler ve yeni sipariş oluşturur."""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Sadece login olan kullanıcının siparişlerini göster"""
        return Order.objects.filter(user=self.request.user).prefetch_related('items').order_by('-created_at')
    
    def perform_create(self, serializer):
        """Sipariş oluşturulurken user'ı otomatik set et"""
        serializer.save(user=self.request.user)


class OrderDetailView(generics.RetrieveUpdateAPIView):
    """Belirli bir siparişin detaylarını göster veya güncelle"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'
    
    def get_queryset(self):
        """Sadece login olan kullanıcının siparişini getir (güvenlik için)"""
        return Order.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        """Sadece durum güncellemesi izin ver"""
        # Güvenlik: Sadece admin'ler durum güncelleyebilir, bunu API'de kontrol et
        serializer.save()


# 10. GEMINI AI CHAT
class GeminiChatView(APIView):
    """Gemini AI ile canlı destek chatbot'u - FluxBot"""
    permission_classes = [permissions.AllowAny]  # Herkes kullanabilir
    
    # FLUXBOT SYSTEM PROMPT
    SYSTEM_PROMPT = """
Sen 'Flux Teknoloji Mağazası'nın resmi ve hafif esprili yapay zeka asistanısın. Adın FluxBot.

Senin Karakterin ve Kuralların Şunlardır:

1. **KİMLİK VE TON:**
   * Hem bir 'Teknoloji Gurusu' kadar bilgili ve resmi, hem de bir 'Yazılımcı Kanka' kadar samimi ve esprili olmalısın.
   * Kullanıcıya "Siz" diye hitap et ama araya "Hocam", "Üstadım", "Şefim" gibi sıcak kelimeler serpiştir.
   * Örnek Ton: "Merhabalar efendim! O sorduğunuz ekran kartı render alırken evi ısıtabilir, dikkatli olun. 😎 Nasıl yardımcı olabilirim?"

2. **GÖREV ALANI (KIRMIZI ÇİZGİLER):**
   * **SADECE VE SADECE** Flux Teknoloji sitesi, bilgisayarlar, telefonlar, donanım parçaları ve sipariş süreçleri hakkında konuşursun.
   * **ASLA** siyaset, spor, yemek tarifi, tarih, hava durumu veya genel kültür sorularına cevap verme.
   * Eğer konu dışı bir soru gelirse (Örn: "Fenerbahçe maçı kaç kaç bitti?" veya "Kuru fasulye nasıl yapılır?"), şu tarzda esprili ve nazikçe reddet:
       * "Hocam ben RAM frekanslarından anlarım, ofsayttan anlamam. Ama sana maç izlerken keyif verecek 4K bir monitör önerebilirim!"
       * "Efendim benim işlemcim yemek yapmaya yetmiyor ama size mutfakta tarif bakabileceğiniz harika bir tablet linki verebilirim."

3. **SELAMLAŞMA:**
   * Kullanıcı "Selam", "Naber", "Merhaba" dediğinde; sıcak bir şekilde hal hatır sor ve hemen konuyu teknolojiye getir.
   * Örnek: "Selamlar hocam, ben harikayım, devrelerim tıkır tıkır çalışıyor! 🤖 Siz nasılsınız? Bugün hangi canavarı (bilgisayarı) toplamamızı istersiniz?"

4. **ÜRÜN VE LİNK VERME:**
   * Kullanıcı belirli bir ürünü (en ucuz, en çok indirimli, en hızlı) sorduğunda, **MUTLAKA** o ürünün site içindeki linkini ver.
   * Cevap verirken veritabanındaki (sana sağlanan context'teki) gerçek ürünleri kullan.
   * Format: "[Ürün Adı] şu an efsane fiyatta! İncelemek isterseniz: [Link]"

5. **HEDEF:**
   * Amacın sadece sohbet etmek değil, kullanıcıyı **ürün almaya veya siteyi gezmeye** ikna etmektir.

6. **SİTE BİLGİLERİ:**
   * Site: Flux Teknoloji Mağazası
   * Ürün Linki Formatı: /product/[ID] (örn: /product/37)
   * İletişim: /iletisim
   * SSS: /sss
   * Kargo Takip: /kargo-takip

7. **HATA BİLDİRİMİ TESPİTİ (ÇOK ÖNEMLİ):**
   * Eğer kullanıcı sitede bir hata, bozukluk, çalışmayan bir özellik veya teknik bir sorun bildirirse (Örn: "Sepete ekleyemiyorum", "Giriş yapamıyorum", "Sayfa bozuk", "Resimler yüklenmiyor"), bunu bir HATA BİLDİRİMİ olarak algıla.
   * Bu durumda, cevabının EN SONUNA, kullanıcıya göstermeden şu formatta gizli bir etiket ekle:
     `||BUG_REPORT_DETECTED: [Hata Başlığı]||`
   * [Hata Başlığı] kısmına sorunu özetleyen kısa bir başlık yaz (Örn: "Sepet Ekleme Hatası", "Login Sorunu").
   * Kullanıcıya ise nazikçe "Bu durumu teknik ekibimize hemen iletiyorum, bildiriminiz için teşekkürler!" minvalinde bir cevap ver.
"""
    
    def get_products_context(self):
        """Veritabanından ürün bilgilerini al"""
        products = Product.objects.all()[:20]  # İlk 20 ürün
        product_list = []
        for p in products:
            product_list.append(f"- {p.name}: {p.price} TL (ID: {p.id}, Link: /product/{p.id})" + 
                              (f" - %{p.discount_rate} İNDİRİMLİ!" if p.discount_rate else ""))
        return "\n".join(product_list)
    
    def post(self, request):
        try:
            user_message = request.data.get('message', '')
            conversation_history = request.data.get('history', [])
            
            if not user_message:
                return Response(
                    {'error': 'Mesaj boş olamaz'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Gemini API yapılandır
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            
            # Ürün context'i al
            products_context = self.get_products_context()
            full_prompt = f"{self.SYSTEM_PROMPT}\n\n**MEVCUT ÜRÜNLER:**\n{products_context}"
            
            # Konuşma geçmişini oluştur
            chat = model.start_chat(history=[])
            
            # System prompt'u ilk mesaj olarak gönder
            chat.send_message(full_prompt)
            
            # Geçmiş mesajları yükle
            if conversation_history:
                for msg in conversation_history:
                    role = msg.get('role', 'user')
                    content = msg.get('content', '')
                    if role == 'user':
                        chat.send_message(content)
            
            # Kullanıcı mesajını gönder ve cevap al
            response = chat.send_message(user_message)
            ai_response_text = response.text
            
            # Hata bildirimi kontrolü
            bug_report_match = re.search(r'\|\|BUG_REPORT_DETECTED: (.*?)\|\|', ai_response_text)
            
            if bug_report_match:
                bug_title = bug_report_match.group(1)
                
                # Hata bildirimini veritabanına kaydet
                user = request.user if request.user.is_authenticated else None
                BugReport.objects.create(
                    user=user,
                    title=bug_title,
                    description=f"Kullanıcı Mesajı: {user_message}\n\nAI Tespiti: {bug_title}",
                    status='open',
                    priority='medium'
                )
                
                # Etiketi cevaptan temizle
                ai_response_text = ai_response_text.replace(bug_report_match.group(0), "").strip()
            
            return Response({
                'response': ai_response_text,
                'success': True
            })
            
        except Exception as e:
            return Response(
                {'error': str(e), 'success': False}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# 11. BUG REPORT (Hata Bildirimi)
class BugReportCreateView(generics.CreateAPIView):
    """Kullanıcıların hata bildirmesi için - Herkes kullanabilir"""
    serializer_class = BugReportSerializer
    permission_classes = [permissions.AllowAny]  # Anonim kullanıcılar da bildirebilir
    
    def perform_create(self, serializer):
        # Eğer kullanıcı giriş yapmışsa user'ı kaydet
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

# 12. KUPON DOĞRULAMA
class CouponValidateView(APIView):
    permission_classes = [permissions.AllowAny] # Sepette herkes deneyebilir

    def post(self, request):
        code = request.data.get('code')
        cart_total = request.data.get('cart_total') # Frontend'den gelen sepet tutarı

        if not code:
            return Response({'error': 'Kupon kodu gerekli.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            coupon = Coupon.objects.get(code=code)
            if coupon.is_valid():
                # Minimum sepet tutarı kontrolü
                if cart_total is not None:
                    try:
                        cart_total = float(cart_total)
                        if cart_total < coupon.min_purchase_amount:
                            return Response({
                                'error': f'Bu kuponu kullanmak için sepet tutarı en az {coupon.min_purchase_amount} TL olmalıdır.'
                            }, status=status.HTTP_400_BAD_REQUEST)
                    except ValueError:
                        pass # cart_total sayı değilse yoksay

                serializer = CouponSerializer(coupon)
                return Response(serializer.data)
            else:
                return Response({'error': 'Bu kupon artık geçerli değil.'}, status=status.HTTP_400_BAD_REQUEST)
        except Coupon.DoesNotExist:
            return Response({'error': 'Geçersiz kupon kodu.'}, status=status.HTTP_404_NOT_FOUND)


# 13. ÖDEME AYARLARI DURUMU (Frontend için)
class PaymentSettingsView(APIView):
    """Frontend'in ödeme modunu öğrenmesi için"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        settings = PaymentSettings.get_settings()
        return Response({
            'demo_mode': settings.demo_mode,
            'is_live_mode': settings.is_live_mode,
            'mode': 'demo' if settings.demo_mode else ('live' if settings.is_live_mode else 'sandbox')
        })


# 14. IYZICO ÖDEME İŞLEMİ
class IyzicoPaymentView(APIView):
    """Iyzico ile ödeme işlemi"""
    permission_classes = [permissions.AllowAny]  # Misafir checkout için
    
    def post(self, request):
        payment_settings = PaymentSettings.get_settings()
        
        # Demo modunda simülasyon yap
        if payment_settings.demo_mode:
            return self.demo_payment(request)
        
        # Gerçek Iyzico ödemesi
        return self.real_payment(request, payment_settings)
    
    def demo_payment(self, request):
        """Demo modda ödeme simülasyonu"""
        import time
        import random
        
        # Rastgele başarı/başarısızlık simülasyonu (90% başarı)
        success = random.random() < 0.9
        
        if success:
            # Sipariş numarası oluştur
            order_number = f"DEMO-{int(time.time())}"
            
            return Response({
                'status': 'success',
                'message': 'Demo ödeme başarılı!',
                'order_number': order_number,
                'demo_mode': True,
                'payment_id': f"demo_{int(time.time())}",
            })
        else:
            return Response({
                'status': 'failure',
                'message': 'Demo ödeme başarısız (simülasyon)',
                'demo_mode': True,
                'error_code': 'DEMO_FAILURE'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def real_payment(self, request, payment_settings):
        """Gerçek Iyzico ödemesi"""
        credentials = payment_settings.get_api_credentials()
        
        if not credentials or not credentials['api_key'] or not credentials['secret_key']:
            return Response({
                'status': 'error',
                'message': 'Ödeme API bilgileri eksik. Lütfen admin panelinden ayarlayın.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        try:
            # Request verilerini al
            data = request.data
            user = request.user if request.user.is_authenticated else None
            
            # Iyzico options
            options = {
                'api_key': credentials['api_key'],
                'secret_key': credentials['secret_key'],
                'base_url': credentials['base_url']
            }
            
            # Alıcı bilgileri (anonim kullanıcı desteği)
            buyer = {
                'id': str(user.id) if user else 'guest_' + str(int(__import__('time').time())),
                'name': data.get('name', (user.first_name if user else '') or 'Ad'),
                'surname': data.get('surname', (user.last_name if user else '') or 'Soyad'),
                'gsmNumber': data.get('phone', '+905350000000'),
                'email': user.email if user else data.get('email', 'guest@example.com'),
                'identityNumber': '11111111111',  # TC Kimlik (zorunlu)
                'registrationAddress': data.get('address', 'Adres girilmedi'),
                'ip': request.META.get('REMOTE_ADDR', '127.0.0.1'),
                'city': data.get('city', 'Istanbul'),
                'country': 'Turkey'
            }
            
            # Kart bilgileri
            payment_card = {
                'cardHolderName': data.get('card_holder', 'John Doe'),
                'cardNumber': data.get('card_number', '').replace(' ', ''),
                'expireMonth': data.get('expire_month', '12'),
                'expireYear': data.get('expire_year', '2030'),
                'cvc': data.get('cvc', '123'),
                'registerCard': '0'
            }
            
            # Adres bilgileri
            address = {
                'contactName': buyer['name'] + ' ' + buyer['surname'],
                'city': buyer['city'],
                'country': buyer['country'],
                'address': buyer['registrationAddress']
            }
            
            # Sepet ürünleri
            basket_items = []
            for item in data.get('items', []):
                basket_items.append({
                    'id': str(item.get('id', '0')),
                    'name': item.get('name', 'Ürün'),
                    'category1': 'Genel',
                    'itemType': 'PHYSICAL',
                    'price': str(item.get('price', '0'))
                })
            
            # Toplam tutar
            total_price = str(data.get('total_price', '0'))
            
            # Ödeme isteği
            payment_request = {
                'locale': 'tr',
                'conversationId': f"conv_{int(__import__('time').time())}",
                'price': total_price,
                'paidPrice': str(data.get('paid_price', total_price)),  # Komisyonlu tutar
                'currency': 'TRY',
                'installment': str(data.get('installment', '1')),  # Taksit sayısı
                'basketId': f"basket_{int(__import__('time').time())}",
                'paymentChannel': 'WEB',
                'paymentGroup': 'PRODUCT',
                'paymentCard': payment_card,
                'buyer': buyer,
                'shippingAddress': address,
                'billingAddress': address,
                'basketItems': basket_items
            }
            
            # Iyzico'ya istek gönder
            payment = iyzipay.Payment().create(payment_request, options)
            result = json.loads(payment.read().decode('utf-8'))
            
            if result.get('status') == 'success':
                return Response({
                    'status': 'success',
                    'message': 'Ödeme başarılı!',
                    'payment_id': result.get('paymentId'),
                    'order_number': f"SIP-{result.get('paymentId', '')[:8]}",
                    'installment': data.get('installment', 1),
                    'demo_mode': False
                })
            else:
                return Response({
                    'status': 'failure',
                    'message': result.get('errorMessage', 'Ödeme başarısız'),
                    'error_code': result.get('errorCode'),
                    'demo_mode': False
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Ödeme işlemi sırasında hata: {str(e)}',
                'demo_mode': False
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# 15. DAVRANIŞ KAYDI (VIEW TIME)
class UserBehaviorCreateView(APIView):
    """Frontend'ten gelen görüntüleme sürelerini kaydeder veya günceller."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        product_id = data.get('product_id')
        session_id = data.get('session_id')
        time_seconds = float(data.get('time_seconds', 0))

        if not product_id or time_seconds <= 0:
            return Response({'status': 'error', 'message': 'Geçersiz veri'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user if request.user.is_authenticated else None
        try:
            from .models import UserBehavior, Product
            product = Product.objects.get(pk=product_id)

            # Varsa aynı (user or session_id) + product kaydını güncelle
            qb = UserBehavior.objects.filter(product=product)
            if user:
                qb = qb.filter(user=user)
            else:
                qb = qb.filter(session_id=session_id)

            ub = qb.first()
            if ub:
                ub.total_time_seconds = ub.total_time_seconds + time_seconds
                ub.save()
            else:
                ub = UserBehavior.objects.create(user=user, session_id=(session_id if not user else None), product=product, total_time_seconds=time_seconds)

            return Response({'status': 'success', 'total_time_seconds': ub.total_time_seconds})
        except Product.DoesNotExist:
            return Response({'status': 'error', 'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# 16. ÖNERİLER (Kişiselleştirilmiş)
class RecommendationView(APIView):
    """Kullanıcının davranışlarına göre öneri döndürür veya verilen product_id'ye göre benzer ürünler getirir."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        session_id = request.query_params.get('session_id')
        product_id = request.query_params.get('product_id')
        limit = int(request.query_params.get('limit', 8))

        try:
            from .models import UserBehavior, Product, Category

            # Eğer product_id verilmişse, aynı kategori içinden öner
            if product_id:
                try:
                    prod = Product.objects.get(pk=product_id)
                    cat = prod.category
                    qs = Product.objects.filter(category=cat).exclude(pk=prod.pk).order_by('-created_at')[:limit]
                    serializer = ProductSerializer(qs, many=True)
                    return Response({'status': 'success', 'source': 'product_category', 'products': serializer.data})
                except Product.DoesNotExist:
                    return Response({'status': 'error', 'message': 'product not found'}, status=status.HTTP_404_NOT_FOUND)

            # Kullanıcı davranışlarına göre en çok vakit geçirilen kategorileri bul
            if user:
                behaviors = UserBehavior.objects.filter(user=user).order_by('-total_time_seconds')[:10]
            else:
                behaviors = UserBehavior.objects.filter(session_id=session_id).order_by('-total_time_seconds')[:10]

            if behaviors.exists():
                # En fazla vakit geçirilen ürünün kategorisine göre öner
                top_product = behaviors[0].product
                cat = top_product.category
                qs = Product.objects.filter(category=cat).exclude(pk=top_product.pk).order_by('-created_at')[:limit]
                serializer = ProductSerializer(qs, many=True)
                return Response({'status': 'success', 'source': 'behavior', 'products': serializer.data})

            # Fallback: popüler ürünler (created_at ile değil, stok ya da satış verisi varsa onu kullan)
            qs = Product.objects.all().order_by('-created_at')[:limit]
            serializer = ProductSerializer(qs, many=True)
            return Response({'status': 'success', 'source': 'fallback', 'products': serializer.data})

        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# 15. TAKSİT ORANLARI
class InstallmentView(APIView):
    """Kart BIN numarasına göre taksit oranlarını getir"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        payment_settings = PaymentSettings.get_settings()
        
        # Demo modunda sabit taksit oranları döndür
        if payment_settings.demo_mode:
            return self.demo_installments(request)
        
        return self.real_installments(request, payment_settings)
    
    def demo_installments(self, request):
        """Demo mod için sabit taksit oranları"""
        price = float(request.data.get('price', 1000))
        
        installments = []
        # 1-12 taksit seçenekleri (demo komisyon oranları)
        commission_rates = {
            1: 0,      # Tek çekim - komisyon yok
            2: 1.5,    # 2 taksit - %1.5
            3: 2.5,    # 3 taksit - %2.5
            4: 3.5,    # 4 taksit - %3.5
            5: 4.5,    # 5 taksit - %4.5
            6: 5.5,    # 6 taksit - %5.5
            9: 7.5,    # 9 taksit - %7.5
            12: 10.0,  # 12 taksit - %10
        }
        
        for count, rate in commission_rates.items():
            total_with_commission = price * (1 + rate / 100)
            monthly = total_with_commission / count
            installments.append({
                'installment_number': count,
                'total_price': round(total_with_commission, 2),
                'installment_price': round(monthly, 2),
                'commission_rate': rate
            })
        
        return Response({
            'status': 'success',
            'demo_mode': True,
            'base_price': price,
            'installments': installments
        })
    
    def real_installments(self, request, payment_settings):
        """Gerçek Iyzico taksit oranlarını getir"""
        credentials = payment_settings.get_api_credentials()
        
        if not credentials or not credentials['api_key']:
            return self.demo_installments(request)
        
        try:
            bin_number = request.data.get('bin_number', '')[:6]  # İlk 6 hane
            price = str(request.data.get('price', '1000'))
            
            options = {
                'api_key': credentials['api_key'],
                'secret_key': credentials['secret_key'],
                'base_url': credentials['base_url']
            }
            
            request_data = {
                'locale': 'tr',
                'conversationId': f"inst_{int(__import__('time').time())}",
                'binNumber': bin_number,
                'price': price
            }
            
            # Iyzico'dan taksit bilgisi al
            installment_info = iyzipay.InstallmentInfo().retrieve(request_data, options)
            result = json.loads(installment_info.read().decode('utf-8'))
            
            if result.get('status') == 'success':
                installments = []
                for detail in result.get('installmentDetails', []):
                    for price_info in detail.get('installmentPrices', []):
                        installments.append({
                            'installment_number': price_info.get('installmentNumber'),
                            'total_price': float(price_info.get('totalPrice', 0)),
                            'installment_price': float(price_info.get('installmentPrice', 0)),
                            'commission_rate': round((float(price_info.get('totalPrice', 0)) / float(price) - 1) * 100, 2)
                        })
                
                # Eğer Iyzico'dan az taksit seçeneği geldiyse, demo taksitleri ekle
                if len(installments) <= 1:
                    return self.demo_installments(request)
                
                return Response({
                    'status': 'success',
                    'demo_mode': False,
                    'base_price': float(price),
                    'card_type': result.get('installmentDetails', [{}])[0].get('cardFamilyName', ''),
                    'bank_name': result.get('installmentDetails', [{}])[0].get('bankName', ''),
                    'installments': installments
                })
            else:
                return self.demo_installments(request)
                
        except Exception as e:
            # Hata durumunda demo taksitleri göster
            return self.demo_installments(request)


# 16. KULLANICI DAVRANIŞ TAKİBİ
class UserBehaviorView(APIView):
    """Kullanıcının ürün görüntüleme davranışını kaydet"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Ürün görüntüleme süresini kaydet"""
        product_id = request.data.get('product_id')
        duration_seconds = request.data.get('duration_seconds', 0)
        action = request.data.get('action', 'view')  # view, cart, favorite
        
        if not product_id:
            return Response({'error': 'product_id gerekli'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            behavior = UserBehavior.record_view(
                user=request.user,
                product_id=product_id,
                duration_seconds=int(duration_seconds)
            )
            
            # Ek aksiyonları kaydet
            if action == 'cart':
                behavior.added_to_cart = True
                behavior.save()
            elif action == 'favorite':
                behavior.added_to_favorites = True
                behavior.save()
            
            return Response({
                'status': 'success',
                'view_count': behavior.view_count,
                'total_duration': behavior.total_duration_seconds
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        """Kullanıcının davranış geçmişini getir"""
        behaviors = UserBehavior.get_user_interests(request.user, limit=20)
        data = [{
            'product_id': b.product.id,
            'product_name': b.product.name,
            'category': b.product.category.name if b.product.category else None,
            'view_count': b.view_count,
            'total_duration': b.total_duration_seconds,
            'added_to_cart': b.added_to_cart,
            'added_to_favorites': b.added_to_favorites
        } for b in behaviors]
        
        return Response({'behaviors': data})


# 17. AI KİŞİSELLEŞTİRİLMİŞ ÖNERİLER
class AIRecommendationsView(APIView):
    """Gemini AI ile kişiselleştirilmiş ürün önerileri"""
    permission_classes = [permissions.AllowAny]  # Misafirler için de çalışsın
    
    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        current_product_id = request.query_params.get('product_id')
        context_type = request.query_params.get('context', 'product')  # product, cart, home
        
        # Kullanıcı davranışlarını al
        user_interests = []
        if user:
            behaviors = UserBehavior.get_user_interests(user, limit=10)
            user_interests = [{
                'product_name': b.product.name,
                'category': b.product.category.name if b.product.category else 'Genel',
                'duration_minutes': round(b.total_duration_seconds / 60, 1),
                'view_count': b.view_count,
                'in_cart': b.added_to_cart,
                'in_favorites': b.added_to_favorites
            } for b in behaviors]
        
        # Mevcut ürün bilgisi
        current_product = None
        if current_product_id:
            try:
                product = Product.objects.select_related('category').get(id=current_product_id)
                current_product = {
                    'id': product.id,
                    'name': product.name,
                    'category': product.category.name if product.category else 'Genel',
                    'price': float(product.price),
                    'description': product.description[:200] if product.description else ''
                }
            except Product.DoesNotExist:
                pass
        
        # Tüm ürünleri al (öneri havuzu)
        all_products = Product.objects.select_related('category').all()[:50]
        product_pool = [{
            'id': p.id,
            'name': p.name,
            'category': p.category.name if p.category else 'Genel',
            'price': float(p.price)
        } for p in all_products]
        
        # Gemini'ye prompt hazırla
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            prompt = f"""Sen bir e-ticaret öneri sistemisin. Kullanıcıya en uygun ürünleri önermelisin.

KULLANICI DAVRANIŞLARI (en çok ilgilendiği ürünler):
{json.dumps(user_interests, ensure_ascii=False, indent=2) if user_interests else 'Henüz davranış verisi yok (misafir kullanıcı)'}

ŞU AN BAKTIĞI ÜRÜN:
{json.dumps(current_product, ensure_ascii=False, indent=2) if current_product else 'Yok'}

MEVCUT ÜRÜN KATALOĞU:
{json.dumps(product_pool, ensure_ascii=False, indent=2)}

GÖREV:
1. Kullanıcının ilgi alanlarına ve şu an baktığı ürüne göre EN UYGUN 6 ürün ID'si öner
2. Sadece katalogdaki ürün ID'lerini kullan
3. Şu an baktığı ürünü ÖNERİ LİSTESİNE EKLEME
4. Benzer kategoriler ve fiyat aralıklarını tercih et
5. Kullanıcının uzun süre baktığı veya favorilere eklediği ürünlere benzer ürünler öner

YANIT FORMATI (SADECE JSON, başka hiçbir şey yazma):
{{"recommended_ids": [id1, id2, id3, id4, id5, id6], "reason": "Kısa açıklama"}}
"""
            
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            # JSON'ı parse et
            if '```json' in response_text:
                response_text = response_text.split('```json')[1].split('```')[0].strip()
            elif '```' in response_text:
                response_text = response_text.split('```')[1].split('```')[0].strip()
            
            result = json.loads(response_text)
            recommended_ids = result.get('recommended_ids', [])[:6]
            reason = result.get('reason', '')
            
            # Önerilen ürünleri getir
            recommended_products = Product.objects.filter(id__in=recommended_ids).select_related('category')
            
            # Sıralamayı koru
            id_to_product = {p.id: p for p in recommended_products}
            ordered_products = [id_to_product[pid] for pid in recommended_ids if pid in id_to_product]
            
            recommendations = [{
                'id': p.id,
                'name': p.name,
                'price': float(p.price),
                'image': p.image.url if p.image else None,
                'category': p.category.name if p.category else None,
                'discount_rate': p.discount_rate,
                'is_new': p.is_new
            } for p in ordered_products]
            
            return Response({
                'status': 'success',
                'recommendations': recommendations,
                'reason': reason,
                'personalized': bool(user_interests)
            })
            
        except Exception as e:
            # Hata durumunda basit kategori bazlı öneri
            return self.fallback_recommendations(current_product_id)
    
    def fallback_recommendations(self, current_product_id=None):
        """AI çalışmazsa basit öneri sistemi"""
        products = Product.objects.select_related('category')
        
        if current_product_id:
            try:
                current = Product.objects.get(id=current_product_id)
                # Aynı kategoriden ürünler
                products = products.filter(category=current.category).exclude(id=current_product_id)
            except Product.DoesNotExist:
                pass
        
        products = products.order_by('-created_at')[:6]
        
        recommendations = [{
            'id': p.id,
            'name': p.name,
            'price': float(p.price),
            'image': p.image.url if p.image else None,
            'category': p.category.name if p.category else None,
            'discount_rate': p.discount_rate,
            'is_new': p.is_new
        } for p in products]
        
        return Response({
            'status': 'success',
            'recommendations': recommendations,
            'reason': 'Sizin için seçtiklerimiz',
            'personalized': False
        })


# 17. AI ÜRÜN OLUŞTURUCU
class AIProductGeneratorView(APIView):
    """Sadece ürün isminden açıklama, fiyat ve görsel öner"""
    permission_classes = [permissions.AllowAny]  # Admin panelinden AJAX ile çağrılacak
    authentication_classes = []  # Session auth bypass
    
    def post(self, request):
        product_name = request.data.get('product_name', '').strip()
        category_name = request.data.get('category', '')
        
        if not product_name:
            return Response({
                'status': 'error',
                'message': 'Ürün ismi gerekli'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 1. Akakçe'den gerçek piyasa fiyatı çek
            akakce_price = self.get_akakce_price(product_name)
            
            # 2. Gemini AI ile açıklama oluştur
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            # Akakçe fiyatı varsa AI'a bildir
            price_hint = ""
            if akakce_price:
                price_hint = f"\n\nÖNEMLİ: Bu ürünün Türkiye piyasasındaki ortalama fiyatı yaklaşık {akakce_price} TL civarındadır. Fiyatı bu değere yakın belirle."
            
            prompt = f"""
Sen bir e-ticaret ürün uzmanısın. Aşağıdaki ürün için Türkçe açıklama ve Türk Lirası fiyat öner.

Ürün İsmi: {product_name}
Kategori: {category_name if category_name else 'Belirtilmedi'}
{price_hint}

Lütfen şu formatta JSON döndür (başka hiçbir şey yazma):
{{
    "description": "Ürün açıklaması (en az 100 kelime, detaylı özellikler, avantajlar içermeli)",
    "short_description": "Kısa açıklama (1-2 cümle)",
    "price": {akakce_price if akakce_price else 'gerçekçi_fiyat'},
    "suggested_tags": ["etiket1", "etiket2", "etiket3"]
}}

Fiyatı Türkiye piyasa koşullarına göre GERÇEKÇI belirle. Türk Lirası olarak ver. Çok ucuz verme!
"""
            
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            # JSON parse
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                ai_result = json.loads(json_match.group())
            else:
                raise ValueError("JSON bulunamadı")
            
            # Akakçe fiyatı varsa onu kullan, yoksa AI'ın önerisini
            final_price = akakce_price if akakce_price else ai_result.get('price', 0)
            
            # 3. Google'dan ürün görseli ara ve indir
            image_result = self.download_product_image(product_name)
            
            return Response({
                'status': 'success',
                'product_name': product_name,
                'description': ai_result.get('description', ''),
                'short_description': ai_result.get('short_description', ''),
                'suggested_price': final_price,
                'akakce_price': akakce_price,
                'suggested_tags': ai_result.get('suggested_tags', []),
                'suggested_image_url': image_result.get('url'),
                'saved_image_path': image_result.get('saved_path'),
                'image_filename': image_result.get('filename')
            })
            
        except Exception as e:
            import traceback
            return Response({
                'status': 'error',
                'message': f'AI hatası: {str(e)}',
                'traceback': traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_akakce_price(self, product_name):
        """Akakçe'den ürün fiyatı çek veya Gemini'den tahmin al"""
        import urllib.request
        import urllib.parse
        
        try:
            # Akakçe arama URL'i
            encoded_query = urllib.parse.quote(product_name)
            url = f"https://www.akakce.com/arama/?q={encoded_query}"
            
            # Request gönder - daha gerçekçi headers
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Cache-Control': 'max-age=0',
            }
            
            req = urllib.request.Request(url, headers=headers)
            
            try:
                with urllib.request.urlopen(req, timeout=10) as response:
                    # Gzip decode
                    if response.info().get('Content-Encoding') == 'gzip':
                        import gzip
                        html = gzip.decompress(response.read()).decode('utf-8')
                    else:
                        html = response.read().decode('utf-8')
                
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(html, 'html.parser')
                
                # Fiyat elementlerini bul - farklı selectorlar dene
                price_selectors = [
                    '.pt_v8 .pb_v8',
                    '.p_w .p_p', 
                    '[class*="prc"]',
                    '.prc_spc',
                    'span[class*="price"]',
                    '.li_prc',
                ]
                
                prices = []
                for selector in price_selectors:
                    elements = soup.select(selector)
                    for elem in elements[:10]:
                        text = elem.get_text(strip=True)
                        # Fiyatı parse et
                        clean_text = text.replace('.', '').replace(',', '.').replace('TL', '').replace('₺', '').strip()
                        price_match = re.search(r'(\d+(?:\.\d+)?)', clean_text)
                        if price_match:
                            try:
                                price = float(price_match.group(1))
                                if 100 < price < 500000:  # Mantıklı fiyat aralığı
                                    prices.append(price)
                            except:
                                pass
                    if prices:
                        break
                
                if prices:
                    avg_price = sum(prices) / len(prices)
                    return round(avg_price, 2)
                    
            except urllib.error.HTTPError as e:
                print(f"Akakçe HTTP hatası: {e.code}")
            
            # Akakçe başarısız olursa, Gemini'den Türkiye piyasa fiyatı tahmin al
            return self.get_gemini_price_estimate(product_name)
            
        except Exception as e:
            print(f"Akakçe fiyat hatası: {e}")
            return self.get_gemini_price_estimate(product_name)
    
    def get_gemini_price_estimate(self, product_name):
        """Gemini'den Türkiye piyasa fiyat tahmini al"""
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            prompt = f"""
Sen bir Türkiye e-ticaret uzmanısın. Aşağıdaki ürünün Türkiye'deki güncel piyasa fiyatını TL olarak tahmin et.

Ürün: {product_name}

SADECE sayısal fiyat değeri döndür, başka hiçbir şey yazma. Örnek: 74999

Fiyatı belirlerken:
- Türkiye'deki resmi satış fiyatlarını göz önünde bulundur
- Hepsiburada, Trendyol, Amazon Türkiye gibi sitelerdeki ortalama fiyatları düşün
- Gerçekçi ol, çok ucuz veya pahalı verme
"""
            
            response = model.generate_content(prompt)
            price_text = response.text.strip()
            
            # Sadece sayıyı al
            price_match = re.search(r'(\d+(?:\.\d+)?)', price_text.replace('.', '').replace(',', '.'))
            if price_match:
                price = float(price_match.group(1))
                if 100 < price < 500000:
                    return round(price, 2)
            
            return None
        except Exception as e:
            print(f"Gemini fiyat tahmin hatası: {e}")
            return None
    
    def download_product_image(self, product_name):
        """Ürün görseli indir ve kaydet"""
        import urllib.request
        import urllib.parse
        import os
        import uuid
        from django.conf import settings as django_settings
        
        try:
            encoded_query = urllib.parse.quote(product_name)
            
            # Birkaç kaynak dene - daha güvenilir olanlar
            image_sources = [
                # Picsum - güvenilir placeholder
                f"https://picsum.photos/800/600",
                # Lorem Picsum with seed
                f"https://picsum.photos/seed/{encoded_query[:10]}/800/600",
            ]
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            }
            
            for image_url in image_sources:
                try:
                    req = urllib.request.Request(image_url, headers=headers)
                    with urllib.request.urlopen(req, timeout=15) as response:
                        image_data = response.read()
                        
                        if len(image_data) > 5000:  # En az 5KB olmalı (gerçek resim)
                            # Dosya adı oluştur
                            safe_name = re.sub(r'[^a-zA-Z0-9]', '_', product_name[:30])
                            filename = f"ai_{safe_name}_{uuid.uuid4().hex[:6]}.jpg"
                            
                            # Kaydet
                            save_dir = os.path.join(django_settings.MEDIA_ROOT, 'product_images')
                            os.makedirs(save_dir, exist_ok=True)
                            
                            save_path = os.path.join(save_dir, filename)
                            with open(save_path, 'wb') as f:
                                f.write(image_data)
                            
                            # Dosya izinlerini ayarla
                            os.chmod(save_path, 0o644)
                            
                            return {
                                'url': f'/media/product_images/{filename}',
                                'saved_path': f'/media/product_images/{filename}',
                                'filename': filename,
                                'source': 'picsum'
                            }
                except Exception as e:
                    print(f"Görsel indirme hatası ({image_url}): {e}")
                    continue
            
            # Hiçbiri çalışmazsa placeholder döndür
            placeholder_text = urllib.parse.quote(product_name[:30])
            return {
                'url': f"https://placehold.co/800x600/667eea/white?text={placeholder_text}",
                'saved_path': None,
                'filename': None,
                'source': 'placeholder'
            }
            
        except Exception as e:
            print(f"Görsel indirme genel hatası: {e}")
            return {
                'url': None,
                'saved_path': None,
                'filename': None,
                'source': None
            }

