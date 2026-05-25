import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          py: 5,
        }}
      >
        <Typography variant="h1" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Страница не найдена
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Запрашиваемая страница не существует или была удалена.
        </Typography>
        <Button variant="contained" component={Link} to="/" size="large">
          Вернуться на главную
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage; 