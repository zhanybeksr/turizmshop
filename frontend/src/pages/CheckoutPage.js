import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/api';

const steps = ['Доставка', 'Проверка', 'Оплата'];

const CheckoutPage = () => {
  const { currentUser } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [orderData, setOrderData] = useState({
    full_name: currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : '',
    email: currentUser ? currentUser.email : '',
    phone: currentUser?.profile?.phone_number || '',
    address: currentUser?.profile?.address || '',
    city: '',
    postal_code: '',
    notes: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError('Ваша корзина пуста');
      return;
    }
    
    const orderItems = cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity
    }));
    
    const orderPayload = {
      ...orderData,
      total_price: totalPrice,
      items: orderItems
    };
    
    try {
      setLoading(true);
      setError('');
      
      const response = await orderService.createOrder(orderPayload);
      
      // Success - clear cart and redirect to order confirmation
      clearCart();
      navigate(`/orders/${response.data.id}`, { 
        state: { orderCreated: true } 
      });
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.detail || 'Ошибка при создании заказа. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };
  
  // Check if cart is empty
  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Ваша корзина пуста
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Добавьте товары в корзину, чтобы оформить заказ
          </Typography>
          <Button variant="contained" onClick={() => navigate('/products')}>
            Перейти к товарам
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Оформление заказа
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {activeStep === 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Информация о доставке
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="ФИО"
                      name="full_name"
                      value={orderData.full_name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={orderData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Телефон"
                      name="phone"
                      value={orderData.phone}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Адрес"
                      name="address"
                      multiline
                      rows={3}
                      value={orderData.address}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Город"
                      name="city"
                      value={orderData.city}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Индекс"
                      name="postal_code"
                      value={orderData.postal_code}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Примечания к заказу"
                      name="notes"
                      multiline
                      rows={2}
                      value={orderData.notes}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            
            {activeStep === 1 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Проверка заказа
                </Typography>
                <List disablePadding>
                  {cart.map((item) => (
                    <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                      <Box
                        component="img"
                        src={item.image || 'https://source.unsplash.com/random?product'}
                        alt={item.name}
                        sx={{ width: 50, height: 50, mr: 2, objectFit: 'cover' }}
                      />
                      <ListItemText 
                        primary={item.name}
                        secondary={`Количество: ${item.quantity}`}
                      />
                      <Typography variant="body2">
                        {(item.price * item.quantity).toFixed(2)} сом
                      </Typography>
                    </ListItem>
                  ))}
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Итого" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {totalPrice.toFixed(2)} сом
                    </Typography>
                  </ListItem>
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                      Доставка
                    </Typography>
                    <Typography gutterBottom>{orderData.full_name}</Typography>
                    <Typography gutterBottom>{orderData.address}</Typography>
                    <Typography gutterBottom>{orderData.city}, {orderData.postal_code}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                      Контактная информация
                    </Typography>
                    <Typography gutterBottom>Email: {orderData.email}</Typography>
                    <Typography gutterBottom>Телефон: {orderData.phone}</Typography>
                    {orderData.notes && (
                      <>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                          Примечания
                        </Typography>
                        <Typography gutterBottom>{orderData.notes}</Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
              </>
            )}
            
            {activeStep === 2 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Оплата
                </Typography>
                <Typography variant="body1" paragraph>
                  В данной версии приложения используется оплата при получении.
                </Typography>
                <Typography variant="body1" paragraph>
                  Нажмите кнопку "Оформить заказ", чтобы завершить оформление.
                </Typography>
                <Alert severity="info">
                  Ваш заказ будет передан в обработку, и наш менеджер свяжется с вами для подтверждения.
                </Alert>
              </>
            )}
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
            >
              Назад
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={loading}
            >
              {loading && <CircularProgress size={24} sx={{ mr: 1 }} />}
              {activeStep === steps.length - 1 ? 'Оформить заказ' : 'Далее'}
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Сводка заказа
            </Typography>
            
            <List disablePadding>
              {cart.map((item) => (
                <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                  <ListItemText 
                    primary={item.name}
                    secondary={`${item.quantity} x ${item.price} сом`}
                  />
                  <Typography variant="body2">
                    {(item.price * item.quantity).toFixed(2)} сом
                  </Typography>
                </ListItem>
              ))}
              
              <Divider sx={{ my: 1.5 }} />
              
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Товары:" />
                <Typography variant="body1">
                  {totalPrice.toFixed(2)} сом
                </Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Доставка:" />
                <Typography variant="body1">
                  Бесплатно
                </Typography>
              </ListItem>
              <ListItem sx={{ py: 1.5, px: 0 }}>
                <ListItemText primary="Итого:" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {totalPrice.toFixed(2)} сом
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage; 