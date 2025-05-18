import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { RootState } from '../../store';
import { getUserProfile, updateUser } from '../../services/api';
import { User } from '../../types';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  useEffect(() => {
    if (!isAuthenticated || userType !== 'user') {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setUser(profileData);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, userType, navigate]);

  const handleEditClick = () => {
    if (user) {
      setEditedUser({
        full_name: user.full_name,
        location: user.location,
        desired_job_title: user.desired_job_title,
        desired_industry: user.desired_industry,
        desired_salary_min: user.desired_salary_min,
        desired_salary_max: user.desired_salary_max,
        experience: user.experience,
        skills_description: user.skills_description,
      });
      setEditDialogOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedUser = await updateUser(editedUser);
      setUser(updatedUser);
      setEditDialogOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Профиль работника
          </Typography>
         
        </Box>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              ФИО
            </Typography>
            <Typography variant="body1">
              {user.full_name}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">
              {user.email}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Telegram ID
            </Typography>
            <Typography variant="body1">
              {user.telegram_id || 'Не указан'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Дата регистрации
            </Typography>
            <Typography variant="body1">
              {new Date(user.created_at).toLocaleDateString()}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Местоположение
            </Typography>
            <Typography variant="body1">
              {user.location}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Желаемая должность
            </Typography>
            <Typography variant="body1">
              {user.desired_job_title}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Желаемая отрасль
            </Typography>
            <Typography variant="body1">
              {user.desired_industry}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Желаемая зарплата
            </Typography>
            <Typography variant="body1">
              {user.desired_salary_min.toLocaleString()} - {user.desired_salary_max.toLocaleString()} ₽
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Опыт работы
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {user.experience || 'Не указан'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Навыки
            </Typography>
            {user.skills && user.skills.length > 0 ? (
              <Grid container spacing={1}>
                {user.skills.map((skill) => (
                  <Grid item key={skill.id}>
                    <Typography variant="body1">
                      {skill.skill} ({skill.years_of_experience} {skill.years_of_experience === 1 ? 'год' : 'лет'})
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1">Не указаны</Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Описание навыков
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {user.skills_description || 'Не указано'}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
            variant="contained"
            color="primary"
            onClick={handleEditClick}
          >
            Изменить
          </Button>
        </Box>
      </Paper>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Изменить профиль</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ФИО"
                value={editedUser.full_name || ''}
                onChange={(e) => setEditedUser({ ...editedUser, full_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Местоположение"
                value={editedUser.location || ''}
                onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Желаемая должность"
                value={editedUser.desired_job_title || ''}
                onChange={(e) => setEditedUser({ ...editedUser, desired_job_title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Желаемая отрасль"
                value={editedUser.desired_industry || ''}
                onChange={(e) => setEditedUser({ ...editedUser, desired_industry: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Минимальная зарплата"
                value={editedUser.desired_salary_min || ''}
                onChange={(e) => setEditedUser({ ...editedUser, desired_salary_min: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Максимальная зарплата"
                value={editedUser.desired_salary_max || ''}
                onChange={(e) => setEditedUser({ ...editedUser, desired_salary_max: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Опыт работы"
                value={editedUser.experience || ''}
                onChange={(e) => setEditedUser({ ...editedUser, experience: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Описание навыков"
                value={editedUser.skills_description || ''}
                onChange={(e) => setEditedUser({ ...editedUser, skills_description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile; 