import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { RootState } from '../store';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userType } = useSelector((state: RootState) => state.auth);

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 0, cursor: 'pointer', mr: 4 }}
            onClick={() => navigate('/')}
          >
            НАЙМPRO
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/jobs')}
              sx={{
                backgroundColor: isActive('/jobs') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
            >
              Вакансии
            </Button>

            {isAuthenticated && (
              <Button
                color="inherit"
                onClick={() => navigate(userType === 'employer' ? '/my-jobs' : '/my-applications')}
                sx={{
                  backgroundColor: isActive(userType === 'employer' ? '/my-jobs' : '/my-applications')
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'transparent'
                }}
              >
                Работа и отклики
              </Button>
            )}
             {isAuthenticated && (
            <>
              <Button
                color="inherit"
                onClick={() => navigate(userType === 'employer' ? '/profile/employer' : '/profile/user')}
                sx={{
                  backgroundColor: isActive(userType === 'employer' ? '/profile/employer' : '/profile/user')
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'transparent'
                }}
              >
                Профиль
              </Button>
            </>
          )}

{isAuthenticated && userType === 'employer' && location.pathname === '/jobs' && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/jobs/create')}
              sx={{ ml: 2 }}
            >
              Создать
            </Button>
          )}
          </Box>

          

         

          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Войти
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Регистрация
              </Button>
            </Box>
          ) : (
            <Button
              color="inherit"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/';
              }}
            >
              Выйти
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 