from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'price', 'quantity']
        read_only_fields = ['id', 'price']
    
    def create(self, validated_data):
        product_id = validated_data.pop('product_id')
        order = validated_data.pop('order')
        from products.models import Product
        product = Product.objects.get(id=product_id)
        order_item = OrderItem.objects.create(
            order=order,
            product=product,
            price=product.price,
            **validated_data
        )
        return order_item

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'full_name', 'email', 'phone', 'address', 'city', 
                  'postal_code', 'created_at', 'updated_at', 'status', 'status_display',
                  'total_price', 'notes', 'items']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_status_display(self, obj):
        return dict(Order.STATUS_CHOICES)[obj.status]

class OrderCreateSerializer(serializers.ModelSerializer):
    items = serializers.ListField(
        child=serializers.DictField(),
        write_only=True
    )
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'full_name', 'email', 'phone', 'address', 'city', 
                  'postal_code', 'notes', 'total_price', 'items']
        read_only_fields = ['id']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        from products.models import Product
        for item_data in items_data:
            product = Product.objects.get(id=item_data['product_id'])
            OrderItem.objects.create(
                order=order,
                product=product,
                price=product.price,
                quantity=item_data['quantity']
            )
        
        return order 