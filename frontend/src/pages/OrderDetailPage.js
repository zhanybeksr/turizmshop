import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { orderService } from '../services/api';

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error'
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  
  // Check if this is a new order
  const isNewOrder = location.state?.orderCreated || false;
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(id);
        setOrder(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Ошибка загрузки заказа. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);
  
  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      await orderService.updateOrder(id, { status: 'cancelled' });
      
      // Refresh order data
      const response = await orderService.getOrderById(id);
      setOrder(response.data);
      
      setCancelDialogOpen(false);
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError('Ошибка при отмене заказа. Пожалуйста, попробуйте позже.');
    } finally {
      setCancelling(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/orders')}
          >
            Назад к заказам
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Заказ не найден</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/orders')}
          >
            Назад к заказам
          </Button>
        </Box>
      </Container>
    );
  }
  
  const canCancel = order.status === 'pending';
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {isNewOrder && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Заказ успешно оформлен! Наш менеджер свяжется с вами для подтверждения.
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Заказ №{order.id}
        </Typography>
        <Chip
          label={order.status_display || order.status}
          color={statusColors[order.status] || 'default'}
        />
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Товары
            </Typography>
            
            <List disablePadding>
              {order.items.map((item) => (
                <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                  <Box
                    component="img"
                    src={item.product.image || 'https://source.unsplash.com/random?product'}
                    alt={item.product.name}
                    sx={{ width: 50, height: 50, mr: 2, objectFit: 'cover' }}
                  />
                  <ListItemText 
                    primary={item.product.name}
                    secondary={`${item.quantity} x ${item.price} сом`}
                  />
                  <Typography variant="body2">
                    {(item.price * item.quantity).toFixed(2)} сом
                  </Typography>
                </ListItem>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Итого" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {order.total_price} сом
                </Typography>
              </ListItem>
            </List>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />}
              component={Link}
              to="/orders"
            >
              Назад к заказам
            </Button>
            
            {canCancel && (
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => setCancelDialogOpen(true)}
              >
                Отменить заказ
              </Button>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Информация о заказе
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Дата заказа
              </Typography>
              <Typography variant="body1">
                {formatDate(order.created_at)}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Информация о доставке
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Получатель
              </Typography>
              <Typography variant="body1">
                {order.full_name}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Адрес
              </Typography>
              <Typography variant="body1">
                {order.address}
              </Typography>
              <Typography variant="body1">
                {order.city}{order.postal_code ? `, ${order.postal_code}` : ''}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Контактная информация
              </Typography>
              <Typography variant="body1">
                Email: {order.email}
              </Typography>
              <Typography variant="body1">
                Телефон: {order.phone}
              </Typography>
            </Box>
            
            {order.notes && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Примечания
                </Typography>
                <Typography variant="body1">
                  {order.notes}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Cancel Order Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Отменить заказ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите отменить заказ №{order.id}? Это действие нельзя будет отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} disabled={cancelling}>
            Отмена
          </Button>
          <Button 
            onClick={handleCancelOrder} 
            color="error" 
            disabled={cancelling}
            autoFocus
          >
            {cancelling ? <CircularProgress size={24} /> : 'Отменить заказ'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderDetailPage; 