import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Pagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ButtonGroup,
  Alert,
  Link,
} from '@mui/material';
import { getUserApplications, deleteApplication, changeNotifyJobApplication } from '../../services/api';
import { RootState } from '../../store';
import { JobApplicationUser } from '../../types';

const UserApplicationsList: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState<JobApplicationUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<JobApplicationUser | null>(null);
  const [error, setError] = useState<string>('');
  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
  const [applicationToSubscribe, setApplicationToSubscribe] = useState<JobApplicationUser | null>(null);
  const pageSize = 10;

  useEffect(() => {
    if (!isAuthenticated || userType !== 'user') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getUserApplications(page, pageSize);
        setApplications(data || []);
        setTotalPages(Math.ceil((data.length || 0) / pageSize));
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, isAuthenticated, userType, navigate]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDeleteClick = (application: JobApplicationUser) => {
    setApplicationToDelete(application);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!applicationToDelete) return;

    try {
      await deleteApplication(applicationToDelete.application_id);
      setApplications(applications.filter(app => app.application_id !== applicationToDelete.application_id));
      setDeleteDialogOpen(false);
      setApplicationToDelete(null);
      setError('');
    } catch (error: any) {
      setError('Произошла ошибка при удалении отклика');
    }
  };

  const handleSubscribe = async (application: JobApplicationUser) => {
    setApplicationToSubscribe(application);
    setSubscribeDialogOpen(true);
  };

  const handleConfirmSubscribe = async () => {
    if (!applicationToSubscribe) return;
    
    try {
      await changeNotifyJobApplication({
        id: applicationToSubscribe.application_id,
        notification: true
      });
      setSubscribeDialogOpen(false);
      setApplicationToSubscribe(null);
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      setError('Ошибка при подписке на уведомления');
    }
  };

  const handleUnsubscribe = async (application: JobApplicationUser) => {
    try {
      await changeNotifyJobApplication({
        id: application.application_id,
        notification: false
      });
      setError('');
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      setError('Ошибка при отписке от уведомлений');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Мои отклики
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {applications.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            У вас пока нет откликов
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Вакансия</TableCell>
                    <TableCell>Компания</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Дата отклика</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.application_id}>
                      <TableCell>
                        <Button
                          onClick={() => navigate(`/jobs/${application.job_id}`)}
                          sx={{ textTransform: 'none' }}
                        >
                          {application.job_title}
                        </Button>
                      </TableCell>
                      <TableCell>{application.company_name}</TableCell>
                      <TableCell>
                      <Box
                          component="span"
                          sx={{
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: (() => {
                              switch (application.application_status) {
                                case 'Applied':
                                  return 'info.light';
                                case 'Seen':
                                  return 'warning.light';
                                case 'Interviewing':
                                  return 'primary.light';
                                case 'Offered':
                                  return 'success.light';
                                case 'Rejected':
                                  return 'error.light';
                                default:
                                  return 'grey.light';
                              }
                            })(),
                          }}
                        >
                          {application.application_status === 'Applied' && 'Отправлено'}
                          {application.application_status === 'Seen' && 'Просмотрено'}
                          {application.application_status === 'Interviewing' && 'Собеседование'}
                          {application.application_status === 'Offered' && 'Предложение'}
                          {application.application_status === 'Rejected' && 'Отказ'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(application.application_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <ButtonGroup>
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={() => handleSubscribe(application)}
                          >
                            Подписаться
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleUnsubscribe(application)}
                          >
                            Отписаться
                          </Button>
                          <Button
                            color="error"
                            onClick={() => handleDeleteClick(application)}
                          >
                            Удалить
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setError('');
        }}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить отклик на вакансию "{applicationToDelete?.job_title}"?
          </Typography>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDeleteDialogOpen(false);
            setError('');
          }}>
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

      <Dialog open={subscribeDialogOpen} onClose={() => {
        setSubscribeDialogOpen(false);
        setApplicationToSubscribe(null);
      }}>
        <DialogTitle>Подписка на уведомления</DialogTitle>
        <DialogContent>
          <Typography>
            Для получения уведомлений перейдите в бота:{' '}
            <Link href="https://t.me/NaymProBot?start=true" target="_blank" rel="noopener">
              t.me/NaymProBot?start=true
            </Link>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setSubscribeDialogOpen(false);
            setApplicationToSubscribe(null);
          }}>
            Отмена
          </Button>
          <Button 
            onClick={handleConfirmSubscribe}
            variant="contained"
            color="primary"
          >
            Написал
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserApplicationsList; 