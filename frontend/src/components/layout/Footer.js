import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: 'primary.dark',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>         
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
              О компании
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
              Туристик.kg - ваш надежный интернет-магазин с быстрой доставкой.
              Мы предлагаем широкий ассортимент товаров высокого качества.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
              Контакты
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
              Адрес: г. Бишкек, ул. 7-Апреля, д. 40
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
              Телефон: +996 (700) 123-45-67
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
              Email: info@turistik.kg
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
              Полезные ссылки
            </Typography>
            <Link 
              href="/products" 
              sx={{ 
                display: 'block', 
                color: 'rgba(255, 255, 255, 0.8)', 
                mb: 1,
                textDecoration: 'none',
                '&:hover': {
                  color: 'white',
                  textDecoration: 'underline',
                }
              }}
            >
              Каталог товаров
            </Link>
            <Link 
              href="/delivery" 
              sx={{ 
                display: 'block', 
                color: 'rgba(255, 255, 255, 0.8)', 
                mb: 1,
                textDecoration: 'none',
                '&:hover': {
                  color: 'white',
                  textDecoration: 'underline',
                }
              }}
            >
              Доставка и оплата
            </Link>
            <Link 
              href="/about" 
              sx={{ 
                display: 'block', 
                color: 'rgba(255, 255, 255, 0.8)', 
                mb: 1,
                textDecoration: 'none',
                '&:hover': {
                  color: 'white',
                  textDecoration: 'underline',
                }
              }}
            >
              О нас
            </Link>
          </Grid>
        </Grid>
        
        <Box 
          sx={{ 
            mt: 5, 
            pt: 3, 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            © {new Date().getFullYear()} Delivery Store. Все права защищены.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 