from rest_framework import serializers

# --- UserBehavior serializer
from .models import UserBehavior

class UserBehaviorSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBehavior
        fields = ['id', 'user', 'session_id', 'product', 'total_time_seconds', 'last_viewed_at']
# !!! SADECE BU MODELLER LAZIM, CUSTOMUSER YOK !!!
from .models import Product, Campaign, SiteConfiguration, Favorite, Review, Category, PromoBanner, ReviewImage, ProductImage, Order, OrderItem, BugReport, Coupon


class RelativeImageField(serializers.ImageField):
    """ImageField that returns relative URL instead of absolute"""
    def to_representation(self, value):
        if not value:
            return None
        return value.url  # Returns /media/... instead of http://localhost/media/...


# 1. KATEGORİ SERIALIZER (Hiyerarşik)
class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'parent', 'children')
    
    def get_children(self, obj):
        # Sadece ana kategoriler için alt kategorileri getir
        children = obj.children.all()
        if children.exists():
            return CategorySerializer(children, many=True).data
        return []

# 2. ÜRÜN SERIALIZER
class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    average_rating = serializers.SerializerMethodField() 
    images = serializers.SerializerMethodField()
    image = RelativeImageField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'image', 'category', 'category_name',
            'is_new', 'discount_rate', 'discount_start_date', 'discount_end_date',
            'average_rating', 'images'
        ]
    
    def get_average_rating(self, obj):
        if hasattr(obj, 'average_rating') and obj.average_rating is not None:
            return round(obj.average_rating, 1)
        return None
    
    def get_images(self, obj):
        images = obj.images.all()
        return ProductImageSerializer(images, many=True).data

# 3. KAMPANYA SERIALIZER
class CampaignSerializer(serializers.ModelSerializer):
    image = RelativeImageField(read_only=True)
    
    class Meta:
        model = Campaign
        fields = ('id', 'title', 'image', 'link_url', 'is_active')

# 4. SİTE AYARLARI SERIALIZER
class SiteConfigurationSerializer(serializers.ModelSerializer):
    topbar_image = RelativeImageField(read_only=True)
    
    class Meta:
        model = SiteConfiguration
        # Sadece kalan alanlar
        fields = ('is_active', 'topbar_image', 'topbar_link')

# 5. FAVORİ SERIALIZER (!!! DÜZELTME BURADA YAPILDI !!!)
class FavoriteSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    class Meta:
        model = Favorite
        fields = ('id', 'user', 'product', 'product_details', 'created_at')
        
        # DİKKAT: Burada sadece 'user' kaldı. 'product' SİLİNDİ.
        # Artık dışarıdan ürün ID'si kabul ediyor.
        read_only_fields = ('user',)

# 6. YORUM (REVIEW) SERIALIZER
class ReviewImageSerializer(serializers.ModelSerializer):
    image = RelativeImageField(read_only=True)
    
    class Meta:
        model = ReviewImage
        fields = ('id', 'image', 'uploaded_at')

class ReviewSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')
    images = ReviewImageSerializer(many=True, read_only=True)
    class Meta:
        model = Review
        fields = ('id', 'user', 'user_username', 'product', 'rating', 'comment', 'created_at', 'images')
        read_only_fields = ('user', 'created_at', 'product', 'images')


# 7.1 ÜRÜN RESİMLERİ SERIALIZER
class ProductImageSerializer(serializers.ModelSerializer):
    image = RelativeImageField(read_only=True)
    
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'alt_text', 'order')



# 7.2 REKLAM BANNER SERIALIZER
class PromoBannerSerializer(serializers.ModelSerializer):
    image = RelativeImageField(read_only=True)
    
    class Meta:
        model = PromoBanner
        fields = ('id', 'title', 'image', 'link_url', 'is_active', 'order')


# 8. SİPARİŞ ÜRÜN SERIALIZER
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.SerializerMethodField()
    product_price = serializers.ReadOnlyField(source='product.price')
    
    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'product_image', 'product_price', 'quantity', 'price')
    
    def get_product_image(self, obj):
        if obj.product and obj.product.image:
            return obj.product.image.url
        return None


# 8.1 SİPARİŞ OLUŞTURMA SERIALIZER (Yazma için)
class OrderItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('product', 'quantity', 'price')


# 8.2 SİPARİŞ SERIALIZER
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    items_data = OrderItemCreateSerializer(many=True, write_only=True, required=False)
    user_email = serializers.ReadOnlyField(source='user.email')
    
    class Meta:
        model = Order
        fields = ('id', 'order_number', 'user', 'user_email', 'total_price', 'customer_name', 
                  'delivery_address', 'status', 'items', 'items_data', 'created_at', 'updated_at')
        read_only_fields = ('user', 'created_at', 'updated_at', 'user_email')
    
    def create(self, validated_data):
        items_data = validated_data.pop('items_data', [])
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order


# 9. BUG REPORT SERIALIZER
class BugReportSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    priority_display = serializers.ReadOnlyField(source='get_priority_display')
    status_display = serializers.ReadOnlyField(source='get_status_display')
    
    class Meta:
        model = BugReport
        fields = (
            'id', 'user', 'user_email', 'title', 'description', 
            'page_url', 'user_agent', 'priority', 'priority_display',
            'status', 'status_display', 'admin_notes', 'created_at', 'updated_at'
        )
        read_only_fields = ('user', 'created_at', 'updated_at', 'user_email', 'priority_display', 'status_display')

# 10. KUPON SERIALIZER
class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ('code', 'discount_percentage', 'valid_from', 'valid_to', 'active', 'min_purchase_amount', 'max_discount_amount')



