import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
  IconButton,
  Divider,
  Alert,
  Card,
  CardMedia,
  CardContent,
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

const CartPage = () => {
  const { cart, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  
  const handleUpdateQuantity = (productId, currentQuantity, change) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    updateQuantity(productId, newQuantity);
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            borderRadius: 4,
            boxShadow: 3
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Ваша корзина пуста
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Добавьте товары в корзину, чтобы оформить заказ
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/products"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            Перейти к товарам
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          mb: 4
        }}
      >
        Корзина
      </Typography>
      
      <Box
        sx={{
          display: { xs: 'block', md: 'flex' },
          alignItems: 'flex-start',
          gap: 4,
        }}
      >
        <Box sx={{ flex: 2, minWidth: 0 }}>
          {cart.map((item) => (
            <Card 
              key={item.id}
              sx={{ 
                mb: 3,
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <Grid container>
                <Grid item xs={12} sm={2}>
                  <CardMedia
                    component="img"
                    image={item.image || 'https://source.unsplash.com/random?product'}
                    alt={item.name}
                    sx={{ 
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: '8px 0 0 8px'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={10}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                        {item.name}
                      </Typography>
                      <IconButton 
                        onClick={() => removeFromCart(item.id)}
                        color="error"
                        size="small"
                        sx={{ 
                          '&:hover': {
                            backgroundColor: 'error.light',
                            color: 'white'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '2.5em'
                      }}
                    >
                      {item.description?.substring(0, 100)}...
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          disabled={item.quantity <= 1}
                          sx={{ 
                            border: '1px solid',
                            borderColor: 'divider',
                            mr: 1,
                            width: 32,
                            height: 32
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                          size="small"
                          value={item.quantity}
                          InputProps={{ 
                            readOnly: true,
                            sx: { 
                              width: 40,
                              textAlign: 'center',
                              height: 32
                            }
                          }}
                        />
                        <IconButton 
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          sx={{ 
                            border: '1px solid',
                            borderColor: 'divider',
                            ml: 1,
                            width: 32,
                            height: 32
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                        {(item.price * item.quantity).toFixed(2)} сом
                      </Typography>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              startIcon={<ArrowBackIcon />}
              component={Link} 
              to="/products"
              sx={{ px: 3 }}
            >
              Продолжить покупки
            </Button>
            <Button 
              startIcon={<DeleteIcon />} 
              onClick={clearCart} 
              color="error"
              sx={{ px: 3 }}
            >
              Очистить корзину
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 320, mt: { xs: 4, md: 0 } }}>
          <Paper 
            sx={{ 
              p: 4,
              borderRadius: 2,
              position: { md: 'sticky' },
              top: { md: 20 },
              boxShadow: 3
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Сводка заказа
            </Typography>
            
            <Box sx={{ my: 3 }}>
              <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
                <Grid item>
                  <Typography>Товары ({cart.length}):</Typography>
                </Grid>
                <Grid item>
                  <Typography>{totalPrice.toFixed(2)} сом</Typography>
                </Grid>
              </Grid>
              
              <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
                <Grid item>
                  <Typography>Доставка:</Typography>
                </Grid>
                <Grid item>
                  <Typography color="success.main" sx={{ fontWeight: 600 }}>
                    Бесплатно
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Grid container justifyContent="space-between" sx={{ mb: 4 }}>
              <Grid item>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Итого:
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                  {totalPrice.toFixed(2)} сом
                </Typography>
              </Grid>
            </Grid>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              size="large"
              onClick={handleCheckout}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                mb: 2
              }}
            >
              Оформить заказ
            </Button>
            
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Оформляя заказ, вы соглашаетесь с условиями доставки и правилами магазина.
            </Alert>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default CartPage; 