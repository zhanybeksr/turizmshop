import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, Box, Rating, IconButton, Chip, InputBase } from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder, NavigateNext, NavigateBefore, LocalShipping, Security, Support, Terrain, AcUnit, WbSunny, DirectionsBike, Hiking, Park } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { productService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import '../style.css';

// Custom styles for Swiper
const swiperStyles = {
  '& .swiper-button-next, & .swiper-button-prev': {
    color: 'white',
    backgroundColor: 'rgba(33, 150, 243, 0.8)',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: 'rgba(33, 150, 243, 1)',
    },
    '&::after': {
      fontSize: '20px',
    },
  },
  '& .swiper-button-next': {
    right: '20px',
  },
  '& .swiper-button-prev': {
    left: '20px',
  },
  '& .swiper-pagination-bullet': {
    width: '12px',
    height: '12px',
    backgroundColor: 'white',
    opacity: 0.5,
  },
  '& .swiper-pagination-bullet-active': {
    backgroundColor: 'white',
    opacity: 1,
  },
  '.category-cards': {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },

};

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Slider images for tourism equipment
  const sliderImages = [
    {
      url: 'https://images.unsplash.com/photo-1501554728187-ce583db33af7?auto=format&fit=crop&w=1200&q=90',
      title: 'Снаряжение для туризма',
      description: 'Все необходимое для вашего приключения'
    },
    {
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=90',
      title: 'Качественное снаряжение',
      description: 'Надежное оборудование для любых условий'
    },
    {
      url: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?auto=format&fit=crop&w=1200&q=90',
      title: 'Экспертный подбор',
      description: 'Поможем выбрать лучшее снаряжение для вашего путешествия'
    }
  ];

  // Features section
  const features = [
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: '#2196F3' }} />,
      title: 'Быстрая доставка',
      description: 'Доставляем по всему Кыргызстану'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#2196F3' }} />,
      title: 'Гарантия качества',
      description: 'Проверенные производители'
    },
    {
      icon: <Support sx={{ fontSize: 40, color: '#2196F3' }} />,
      title: 'Поддержка 24/7',
      description: 'Всегда на связи'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, productsResponse] = await Promise.all([
          productService.getCategories(),
          productService.getProducts({ in_stock: true })
        ]);

        setCategories(categoriesResponse.data.results || categoriesResponse.data);

        // Get 4 featured products
        const products = productsResponse.data.results || productsResponse.data;
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <Container maxWidth="lg">
      {/* Hero Section with Slider */}
      <Box sx={{ mb: 8, borderRadius: 4, overflow: 'hidden' }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
          style={swiperStyles}
        >
          {sliderImages.map((slide, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  position: 'relative',
                  height: '600px',
                  backgroundImage: `url(${slide.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    backgroundColor: 'rgba(0,0,0,.4)',
                    backdropFilter: 'blur(2px)',
                  }}
                />
                <Box
                  sx={{
                    position: 'relative',
                    p: 6,
                    textAlign: 'center',
                    maxWidth: '800px',
                    color: 'white',
                  }}
                >
                  <Typography
                    component="h1"
                    variant="h2"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      mb: 3,
                      color: 'white',
                    }}
                  >
                    {slide.title}
                  </Typography>
                  <Typography
                    variant="h5"
                    paragraph
                    sx={{
                      mb: 4,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      color: 'white',
                    }}
                  >
                    {slide.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/products"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      backgroundColor: '#2196F3',
                      '&:hover': {
                        backgroundColor: '#1976D2',
                      },
                    }}
                  >
                    Смотреть каталог
                  </Button>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <div className='category-cards'>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 4,
                  '&:hover': {
                    boxShadow: '0px 8px 24px rgba(33, 150, 243, 0.15)',
                  },
                }}
              >
                <Box sx={{ color: '#2196F3', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#000000' }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </div>
      </Box>

      {/* Categories Section */}
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 4,
          color: '#000000',
        }}
      >
        Категории снаряжения
      </Typography>

      <div className='category-cards'>
        {categories.map((category) => (
          <div className='category-card'>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={category.image || 'https://source.unsplash.com/random?camping'}
                alt={category.name}
                sx={{
                  objectFit: 'cover',
                }}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {category.name}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    mb: 2,
                  }}
                >
                  {category.description || 'Откройте для себя снаряжение в этой категории'}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  to={`/products?category=${category.id}`}
                  color="primary"
                  endIcon={<NavigateNext />}
                >
                  Смотреть товары
                </Button>
              </CardActions>
            </Card>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 3 - categories.length) }).map((_, idx) => (
          <Grid item key={`empty-cat-${idx}`} xs={12} sm={6} md={4} />
        ))}
      </div>

      {/* Featured Products Section */}
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 700,
          mt: 8,
          mb: 4,
          color: 'text.primary',
        }}
      >
        Популярное снаряжение
      </Typography>

      <div className='category-cards'>
        {featuredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image || 'https://source.unsplash.com/random?camping-gear'}
                alt={product.name}
                sx={{
                  objectFit: 'cover',
                }}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={product.rating || 4.5} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({product.reviews_count || 12})
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  {product.price} сом
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCart />}
                  onClick={() => handleAddToCart(product)}
                  fullWidth
                >
                  В корзину
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {Array.from({ length: Math.max(0, 3 - featuredProducts.length) }).map((_, idx) => (
          <Grid item key={`empty-prod-${idx}`} xs={12} sm={6} md={4} />
        ))}
      </div>

      {/* Interesting Facts Section */}
      <Box sx={{ mt: 8, mb: 8, backgroundColor: '#E3F2FD', py: 6, borderRadius: 4 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 6,
              color: '#000000',
              textAlign: 'center'
            }}
          >
            Интересные факты о туризме
          </Typography>

          <div className='category-cards'>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Terrain sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Горы и высота
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  Самая высокая гора в мире - Эверест (8848 м). Для восхождения требуется специальное снаряжение и подготовка.
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AcUnit sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Холодные регионы
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  В Антарктиде температура может опускаться до -89°C. Правильная экипировка критически важна для выживания.
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WbSunny sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Жаркие пустыни
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  В пустыне Сахара температура может достигать +50°C. Необходимо иметь достаточный запас воды и защиту от солнца.
                </Typography>
              </Card>
            </Grid>
          </div>
        </Container>
      </Box>

      {/* Types of Tourism Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 6,
            color: '#000000',
            textAlign: 'center'
          }}
        >
          Виды туризма
        </Typography>

        <div className='category-cards'>
          <Grid item xs={12} md={4}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              p: 3,
              '&:hover': {
                boxShadow: '0px 8px 24px rgba(33, 150, 243, 0.15)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease'
              }
            }}>
              <Box sx={{ mr: 3 }}>
                <Park sx={{ fontSize: 48, color: '#2196F3' }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Походы
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Отдых на природе с палаткой, костром и звездным небом над головой.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<NavigateNext />}
                >
                  Подробнее
                </Button>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>

            <Card sx={{
              height: '100%',
              display: 'flex',
              p: 3,
              '&:hover': {
                boxShadow: '0px 8px 24px rgba(33, 150, 243, 0.15)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease'
              }
            }}>
              <Box sx={{ mr: 3 }}>
                <Hiking sx={{ fontSize: 48, color: '#2196F3' }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Пеший туризм
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Исследуйте природу пешком, наслаждаясь живописными пейзажами и чистым воздухом.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<NavigateNext />}
                >
                  Подробнее
                </Button>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              p: 3,
              '&:hover': {
                boxShadow: '0px 8px 24px rgba(33, 150, 243, 0.15)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease'
              }
            }}>
              <Box sx={{ mr: 3 }}>
                <Park sx={{ fontSize: 48, color: '#2196F3' }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Кемпинг
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Отдых на природе с палаткой, костром и звездным небом над головой.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<NavigateNext />}
                >
                  Подробнее
                </Button>
              </Box>
            </Card>
          </Grid>

        </div>
      </Box>

      {/* Newsletter Section */}
      <Box sx={{
        mb: 8,
        backgroundColor: '#2196F3',
        py: 6,
        borderRadius: 4,
        color: 'white'
      }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
              textAlign: 'center'
            }}
          >
            Подпишитесь на новости
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              textAlign: 'center',
              opacity: 0.9
            }}
          >
            Получайте информацию о новых поступлениях и специальных предложениях
          </Typography>
          <Box sx={{
            display: 'flex',
            gap: 2,
            maxWidth: 600,
            mx: 'auto'
          }}>
            <InputBase
              placeholder="Ваш email"
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                px: 2,
                py: 1,
                flex: 1
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: '#2196F3',
                '&:hover': {
                  backgroundColor: '#E3F2FD'
                }
              }}
            >
              Подписаться
            </Button>
          </Box>
        </Container>
      </Box>
    </Container>
  );
};

export default HomePage; 