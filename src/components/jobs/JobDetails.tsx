import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import { getJobDetails, applyToJob, getUserApplicationById, deleteJob, updateJob, getEmployerApplications } from '../../services/api';
import { Job } from '../../types';
import { RootState } from '../../store';

const JobDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editedJob, setEditedJob] = useState<Partial<Job>>({});
  const { isAuthenticated, userType } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        if (id) {
          const jobData = await getJobDetails(parseInt(id));
          setJob(jobData);
          setEditedJob(jobData);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleEditClick = () => {
    setOpenEditDialog(true);
  };

  const handleEditSave = async () => {
    try {
      if (id && editedJob) {
        // First check if there are any applications
        const applications = await getEmployerApplications(parseInt(id));
        if (applications && applications.length > 0) {
          setError('Нельзя изменить вакансию, если на нее уже кто-то откликнулся');
          setOpenEditDialog(false);
          return;
        }

        await updateJob(parseInt(id), editedJob);
        const updatedJob = await getJobDetails(parseInt(id));
        setJob(updatedJob);
        setOpenEditDialog(false);
        setSuccess('Вакансия успешно обновлена');
        window.location.reload();
      }
    } catch (error: any) {
      if (error.response?.status === 500 && error.response?.data?.error?.includes('no document found with jobID')) {
        setSuccess('Вакансия успешно обновлена');
        setOpenEditDialog(false);
        window.location.reload();
      } else {
        setError('Ошибка при обновлении вакансии');
      }
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedJob(prev => ({
      ...prev,
      [name]: name.includes('salary') ? Number(value) : value
    }));
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (userType !== 'user') {
      setError('Only job seekers can apply for jobs');
      return;
    }
    
    setOpenApplyDialog(true);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (id) {
        await deleteJob(parseInt(id));
        setOpenDeleteDialog(false);
        navigate('/jobs');
      }
    } catch (error: any) {
      if (error.response?.data?.error?.includes('violates foreign key constraint "job_applications_job_id_fkey"')) {
        setError('Невозможно удалить вакансию на которую уже откликнулись');
        setOpenDeleteDialog(false);
      } else {
        setError('Ошибка при удалении вакансии');
      }
    }
  };

  const handleApply = async () => {
    if (!cvFile) {
      setError('Загрузите pdf файл с резюме');
      setOpenApplyDialog(false);
      return;
    }

    try {
      if (id) {
        const response = await applyToJob(parseInt(id), message, cvFile);
        const applicationDetails = await getUserApplicationById(response.id);
        setSuccess('Вы успешно откликнулись!');
        setOpenApplyDialog(false);
        setMessage('');
        setCvFile(null);
      }
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.error?.includes('already applied')) {
        setError('Вы уже отозвались на эту вакансию');
      } else {
        setError('Failed to submit application');
      }
    }
  };

  if (!job) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {job.title}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {job.company_name}
        </Typography>

        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Местоположение: {job.location}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Отрасль: {job.industry}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Зарплата: {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} ₽
          </Typography>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom>
            Описание вакансии
          </Typography>
          <Typography variant="body1" paragraph>
            {job.description}
          </Typography>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom>
            Требования
          </Typography>
          <Typography variant="body1" paragraph>
            {job.requirements}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          {userType === 'employer' ? (
            <>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate(`/jobs/${id}/applications`)}
              >
                Просмотр откликов
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleEditClick}
              >
                Изменить
              </Button>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleDeleteClick}
              >
                Удалить
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleApplyClick}
            >
              Откликнуться
            </Button>
          )}
        </Box>
      </Paper>

      <Dialog open={openApplyDialog} onClose={() => setOpenApplyDialog(false)}>
        <DialogTitle>Отклик на вакансию</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Сопроводительное письмо"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            component="label"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
          >
            Загрузить резюме
            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.type === 'application/pdf') {
                  setCvFile(file);
                  setError('');
                } else {
                  setError('Пожалуйста, выберите файл в формате PDF');
                  setCvFile(null);
                  e.target.value = ''; // Reset the input
                }
              }}
            />
          </Button>
          {cvFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Выбран файл: {cvFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApplyDialog(false)}>Отмена</Button>
          <Button onClick={handleApply} variant="contained">
            Отправить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить вакансию "{job.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Редактирование вакансии</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Название вакансии"
              name="title"
              value={editedJob.title || ''}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              label="Местоположение"
              name="location"
              value={editedJob.location || ''}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              label="Отрасль"
              name="industry"
              value={editedJob.industry || ''}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              label="Описание"
              name="description"
              multiline
              rows={4}
              value={editedJob.description || ''}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              label="Требования"
              name="requirements"
              multiline
              rows={4}
              value={editedJob.requirements || ''}
              onChange={handleEditChange}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Минимальная зарплата"
                name="salary_min"
                type="number"
                value={editedJob.salary_min || ''}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                label="Максимальная зарплата"
                name="salary_max"
                type="number"
                value={editedJob.salary_max || ''}
                onChange={handleEditChange}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>
            Отмена
          </Button>
          <Button 
            onClick={handleEditSave}
            variant="contained"
            color="primary"
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobDetails; 