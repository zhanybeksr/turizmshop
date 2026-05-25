import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { currentUser, updateProfile, error: authError } = useAuth();
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setUserData({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        email: currentUser.email || '',
        phone_number: currentUser.profile?.phone_number || '',
        address: currentUser.profile?.address || '',
      });
      
      if (currentUser.profile?.profile_picture) {
        setProfileImageUrl(currentUser.profile.profile_picture);
      }
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setProfileImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    const formData = new FormData();
    
    if (profileImage) {
      formData.append('profile_picture', profileImage);
    }
    
    formData.append('phone_number', userData.phone_number);
    formData.append('address', userData.address);
    
    try {
      await updateProfile(formData);
      setSuccess('Профиль успешно обновлен');
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка обновления профиля');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Container component="main" maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography>Пожалуйста, войдите для доступа к профилю</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Мой профиль
        </Typography>
        
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {(error || authError) && <Alert severity="error" sx={{ mb: 2 }}>{error || authError}</Alert>}
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={profileImageUrl}
              alt={currentUser.username}
              sx={{ width: 150, height: 150, mb: 2 }}
            >
              <AccountCircleIcon sx={{ fontSize: 150 }} />
            </Avatar>
            
            <input
              accept="image/*"
              id="profile-image-input"
              type="file"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <label htmlFor="profile-image-input">
              <Button variant="outlined" component="span" sx={{ mt: 1 }}>
                Изменить фото
              </Button>
            </label>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom>
                Основная информация
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Имя пользователя"
                    value={currentUser.username}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={userData.email}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Имя"
                    name="first_name"
                    value={userData.first_name}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Фамилия"
                    name="last_name"
                    value={userData.last_name}
                    disabled
                  />
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Контактная информация
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Номер телефона"
                    name="phone_number"
                    value={userData.phone_number}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Адрес"
                    name="address"
                    multiline
                    rows={3}
                    value={userData.address}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Сохранить изменения'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage; 