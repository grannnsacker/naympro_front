import React, { useState } from 'react';
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
  Grid,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { registerUser, registerEmployer } from '../../services/api';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'user' | 'employer'>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    location: '',
    desired_industry: '',
    desired_job_title: '',
    desired_salary_min: '',
    desired_salary_max: '',
    experience: '',
    skills_description: '',
    telegram_id: '',
  });

  const [employerFormData, setEmployerFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    company_name: '',
    company_industry: '',
    company_location: '',
  });

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser({
        ...userFormData,
        desired_salary_min: Number(userFormData.desired_salary_min),
        desired_salary_max: Number(userFormData.desired_salary_max),
      });
      
      navigate('/login');
    } catch (err) {
      setError('Ошибка при регистрации');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerEmployer(employerFormData);
      
      navigate('/login');
    } catch (err) {
      setError('Ошибка при регистрации');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFormData({
      ...userFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmployerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployerFormData({
      ...employerFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Регистрация
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={userType}
            exclusive
            onChange={(_, newValue) => newValue && setUserType(newValue)}
          >
            <ToggleButton value="user">Работник</ToggleButton>
            <ToggleButton value="employer">Работодатель</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {userType === 'user' ? (
          <form onSubmit={handleUserSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={userFormData.email}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Пароль"
                  name="password"
                  type="password"
                  value={userFormData.password}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <TextField
                    required
                    fullWidth
                    label="Telegram ID"
                    name="telegram_id"
                    value={userFormData.telegram_id}
                    onChange={handleUserChange}
                    helperText="Введите ваш Telegram ID (например: 12345678)"
                  />
                  <Tooltip title="Чтобы посмотреть свой id воспользутесь ботом @myidbot">
                    <IconButton size="small" sx={{ mt: 1 }}>
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="ФИО"
                  name="full_name"
                  value={userFormData.full_name}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Местоположение"
                  name="location"
                  value={userFormData.location}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Желаемая должность"
                  name="desired_job_title"
                  value={userFormData.desired_job_title}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Желаемая отрасль"
                  name="desired_industry"
                  value={userFormData.desired_industry}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Минимальная зарплата"
                  name="desired_salary_min"
                  type="number"
                  value={userFormData.desired_salary_min}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Максимальная зарплата"
                  name="desired_salary_max"
                  type="number"
                  value={userFormData.desired_salary_max}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Опыт работы"
                  name="experience"
                  multiline
                  rows={3}
                  value={userFormData.experience}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Описание навыков"
                  name="skills_description"
                  multiline
                  rows={3}
                  value={userFormData.skills_description}
                  onChange={handleUserChange}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
              >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </Box>
          </form>
        ) : (
          <form onSubmit={handleEmployerSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={employerFormData.email}
                  onChange={handleEmployerChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Пароль"
                  name="password"
                  type="password"
                  value={employerFormData.password}
                  onChange={handleEmployerChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="ФИО"
                  name="full_name"
                  value={employerFormData.full_name}
                  onChange={handleEmployerChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Название компании"
                  name="company_name"
                  value={employerFormData.company_name}
                  onChange={handleEmployerChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Отрасль компании"
                  name="company_industry"
                  value={employerFormData.company_industry}
                  onChange={handleEmployerChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Местоположение компании"
                  name="company_location"
                  value={employerFormData.company_location}
                  onChange={handleEmployerChange}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
              >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default RegisterForm; 