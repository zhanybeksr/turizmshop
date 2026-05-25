from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer, OrderCreateSerializer

# Create your views here.

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.is_staff

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        return OrderItem.objects.filter(order__user=self.request.user)
    
    def perform_create(self, serializer):
        order_id = self.kwargs.get('order_pk')
        order = Order.objects.get(id=order_id)
        if order.user != self.request.user and not self.request.user.is_staff:
            return Response(
                {"detail": "You do not have permission to add items to this order."},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save(order=order)
