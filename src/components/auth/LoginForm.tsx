import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { loginUser, loginEmployer } from '../../services/api';
import { setUserCredentials, setEmployerCredentials } from '../../store/authSlice';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'user' | 'employer'>('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (userType === 'user') {
        const response = await loginUser(formData);
        console.log(response)
        dispatch(setUserCredentials({ 
          token: response.access_token, 
          user: response.user! 
        }));
        navigate('/jobs');
      } else {
        const response = await loginEmployer(formData);
        dispatch(setEmployerCredentials({ 
          token: response.access_token, 
          employer: response.employer! 
        }));
        navigate('/jobs');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center">
          Вход в систему
        </Typography>
        <Box sx={{ mt: 2, mb: 2 }}>
          <ToggleButtonGroup
            value={userType}
            exclusive
            onChange={(_, value) => value && setUserType(value)}
            fullWidth
          >
            <ToggleButton value="user">Работник</ToggleButton>
            <ToggleButton value="employer">Работодатель</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Электронная почта"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              Неверные учетные данные
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/register')}
          >
            Нет аккаунта? Зарегистрироваться
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm; 