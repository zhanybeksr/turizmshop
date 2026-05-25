import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { productService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import '../style.css';

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);

  const { addToCart } = useCart();
  const productsPerPage = 8;

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getProducts({ in_stock: true });
        const data = response.data.results || response.data;
        setAllProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Ошибка загрузки товаров');
        setLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        setCategories(response.data.results || response.data);
      } catch (err) {
        setError('Ошибка загрузки категорий товаров');
      }
    };
    fetchAllProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = allProducts;
    if (selectedCategory) {
      filtered = filtered.filter(p => String(p.category) === String(selectedCategory));
    }
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setTotalPages(Math.max(1, Math.ceil(filtered.length / productsPerPage)));
    setProducts(filtered.slice((page - 1) * productsPerPage, page * productsPerPage));
  }, [allProducts, selectedCategory, searchTerm, page]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4, color: '#1976d2', letterSpacing: '-1px' }}>
        Каталог товаров
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{
        background: '#fff',
        borderRadius: 4,
        boxShadow: '0 2px 16px 0 rgba(33,150,243,0.07)',
        p: { xs: 2, md: 4 },
        mb: 5
      }}>
        <div className='category-cards'>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="medium" sx={{ background: '#f5f7fa', borderRadius: 2 }}>
              <InputLabel id="category-select-label">Категория</InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategory}
                label="Категория"
                onChange={handleCategoryChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">Все категории</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Поиск товаров"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchInputChange}
                sx={{ background: '#f5f7fa', borderRadius: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ px: 4, borderRadius: 2, fontWeight: 600, fontSize: '1.1rem', boxShadow: 'none', background: 'linear-gradient(90deg,#2196f3 0,#1976d2 100%)' }}
              >
                Найти
              </Button>
            </Box>
          </Grid>
        </div>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Alert severity="info">
          Товары не найдены. Попробуйте изменить параметры поиска.
        </Alert>
      ) : (
        <div className='category-cards'>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: '0 4px 24px 0 rgba(33,150,243,0.10)',
                  transition: '0.3s',
                  background: '#fff',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.03)',
                    boxShadow: '0 8px 32px 0 rgba(33,150,243,0.18)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image || 'https://source.unsplash.com/random?product'}
                  alt={product.name}
                  sx={{ objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1, color: '#222' }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {product.description?.substring(0, 100)}...
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 700, mb: 1 }}>
                    {product.price} сом
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Категория: {product.category_name}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    size="large" 
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(product)}
                    fullWidth
                    variant="contained"
                    sx={{
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      borderRadius: 2,
                      background: 'linear-gradient(90deg,#2196f3 0,#1976d2 100%)',
                      boxShadow: 'none',
                      py: 1.2,
                      '&:hover': {
                        background: 'linear-gradient(90deg,#1976d2 0,#2196f3 100%)',
                        boxShadow: '0 4px 16px 0 rgba(33,150,243,0.12)',
                      },
                    }}
                  >
                    В корзину
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </div>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1.1rem',
            }
          }}
        />
      </Box>
    </Container>
  );
};

export default ProductsPage; 