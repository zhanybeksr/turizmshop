from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, OrderItemViewSet

router = DefaultRouter()
router.register('orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('orders/<int:order_pk>/items/', OrderItemViewSet.as_view({'get': 'list', 'post': 'create'}), name='order-items'),
    path('orders/<int:order_pk>/items/<int:pk>/', OrderItemViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='order-item-detail'),
] 