import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Menu, MenuItem, Avatar, Box, Container, InputBase } from '@mui/material';
import { ShoppingCart, AccountCircle, Menu as MenuIcon, Search, Hiking, LocalShipping, Support } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };
  
  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'white',
        boxShadow: '0px 2px 8px rgba(33, 150, 243, 0.1)',
        marginBottom: 2
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              color="primary"
              aria-label="menu"
              sx={{ display: { md: 'none' }, mr: 2 }}
              onClick={toggleMobileMenu}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography 
              variant="h5" 
              component={Link} 
              to="/" 
              sx={{ 
                textDecoration: 'none', 
                color: '#2196F3',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Hiking sx={{ fontSize: 28 }} />
              Туристик
            </Typography>
          </Box>

          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center',
            gap: 2
          }}>
            <Button 
              color="primary" 
              component={Link} 
              to="/"
              sx={{ fontWeight: 600 }}
            >
              Главная
            </Button>
            <Button 
              color="primary" 
              component={Link} 
              to="/about"
              sx={{ fontWeight: 600 }}
            >
              О нас
            </Button>
            {currentUser && (
              <Button 
                color="primary" 
                component={Link} 
                to="/orders"
                sx={{ fontWeight: 600 }}
              >
                Мои заказы
              </Button>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                backgroundColor: '#F5F5F5',
                borderRadius: 2,
                px: 2,
                py: 0.5
              }}
            >
              <Search sx={{ color: '#757575', mr: 1 }} />
              <InputBase 
                placeholder="Поиск снаряжения..." 
                sx={{ color: '#000000' }}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
            </Box>
            {/* Mobile search button */}
            <IconButton
              sx={{ display: { xs: 'inline-flex', md: 'none' }, color: '#2196F3' }}
              onClick={handleSearchSubmit}
            >
              <Search />
            </IconButton>

            <IconButton 
              color="primary" 
              component={Link} 
              to="/cart"
              sx={{ 
                backgroundColor: '#F5F5F5',
                '&:hover': { backgroundColor: '#E3F2FD' }
              }}
            >
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            
            {currentUser ? (
              <>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="primary"
                  sx={{ 
                    backgroundColor: '#F5F5F5',
                    '&:hover': { backgroundColor: '#E3F2FD' }
                  }}
                >
                  {currentUser.profile?.profile_picture ? (
                    <Avatar 
                      src={currentUser.profile.profile_picture} 
                      alt={currentUser.username} 
                      sx={{ width: 32, height: 32 }} 
                    />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>Профиль</MenuItem>
                  <MenuItem component={Link} to="/orders" onClick={handleMenuClose}>Мои заказы</MenuItem>
                  <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                </Menu>
              </>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/login"
                sx={{ 
                  fontWeight: 600,
                  px: 3
                }}
              >
                Войти
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <Box sx={{ 
          display: { xs: 'block', md: 'none' }, 
          backgroundColor: 'white',
          borderTop: '1px solid #E3F2FD',
          py: 1
        }}>
          <Container maxWidth="lg">
            <Button color="primary" component={Link} to="/" fullWidth sx={{ justifyContent: 'flex-start', py: 1 }}>
              Главная
            </Button>
            <Button color="primary" component={Link} to="/products" fullWidth sx={{ justifyContent: 'flex-start', py: 1 }}>
              Каталог
            </Button>
            <Button color="primary" component={Link} to="/about" fullWidth sx={{ justifyContent: 'flex-start', py: 1 }}>
              О нас
            </Button>
            {currentUser && (
              <Button color="primary" component={Link} to="/orders" fullWidth sx={{ justifyContent: 'flex-start', py: 1 }}>
                Мои заказы
              </Button>
            )}
          </Container>
        </Box>
      )}
    </AppBar>
  );
};

export default Header; 