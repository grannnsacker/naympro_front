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
import { getEmployerProfile, updateEmployer } from '../../services/api';
import { Employer } from '../../types';

const EmployerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useSelector((state: RootState) => state.auth);
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedEmployer, setEditedEmployer] = useState<Partial<Employer>>({});

  useEffect(() => {
    if (!isAuthenticated || userType !== 'employer') {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const profileData = await getEmployerProfile();
        setEmployer(profileData);
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
    if (employer) {
      setEditedEmployer({
        full_name: employer.full_name,
        company_name: employer.company_name,
        company_industry: employer.company_industry,
        company_location: employer.company_location,
      });
      setEditDialogOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedEmployer = await updateEmployer(editedEmployer);
      setEmployer(updatedEmployer);
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

  if (!employer) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Профиль работодателя
          </Typography>
         
        </Box>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              ФИО
            </Typography>
            <Typography variant="body1">
              {employer.full_name}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">
              {employer.email}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Название компании
            </Typography>
            <Typography variant="body1">
              {employer.company_name}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Отрасль компании
            </Typography>
            <Typography variant="body1">
              {employer.company_industry}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Местоположение компании
            </Typography>
            <Typography variant="body1">
              {employer.company_location}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Дата регистрации
            </Typography>
            <Typography variant="body1">
              {new Date(employer.employer_created_at).toLocaleDateString()}
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
                value={editedEmployer.full_name || ''}
                onChange={(e) => setEditedEmployer({ ...editedEmployer, full_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название компании"
                value={editedEmployer.company_name || ''}
                onChange={(e) => setEditedEmployer({ ...editedEmployer, company_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Отрасль компании"
                value={editedEmployer.company_industry || ''}
                onChange={(e) => setEditedEmployer({ ...editedEmployer, company_industry: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Местоположение компании"
                value={editedEmployer.company_location || ''}
                onChange={(e) => setEditedEmployer({ ...editedEmployer, company_location: e.target.value })}
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

export default EmployerProfile; 