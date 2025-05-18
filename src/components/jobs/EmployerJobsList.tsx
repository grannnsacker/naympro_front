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
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ButtonGroup,
} from '@mui/material';
import { getEmployerJobs, deleteJob } from '../../services/api';
import { RootState } from '../../store';
import { Job } from '../../types';

const EmployerJobsList: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useSelector((state: RootState) => state.auth);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [error, setError] = useState<string>('');
  const pageSize = 10;

  useEffect(() => {
    if (!isAuthenticated || userType !== 'employer') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getEmployerJobs(page, pageSize);
        setJobs(data || []);
        setTotalPages(Math.ceil((data.length || 0) / pageSize));
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, isAuthenticated, userType, navigate]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDeleteClick = (job: Job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
      await deleteJob(jobToDelete.id);
      setJobs(jobs.filter(job => job.id !== jobToDelete.id));
      setDeleteDialogOpen(false);
      setJobToDelete(null);
      setError('');
    } catch (error: any) {
      if (error.response?.data?.error?.includes('violates foreign key constraint "job_applications_job_id_fkey"')) {
        setError('Невозможно удалить вакансию на которую уже откликнулись');
      } else {
        setError('Произошла ошибка при удалении вакансии');
      }
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
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Мои вакансии
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/jobs/create')}
          >
            Создать вакансию
          </Button>
        </Box>

        {jobs.length === 0 ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ mb: 2 }}>У вас пока нет опубликованных вакансий</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/jobs/create')}
            >
              Создать вакансию
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Название</TableCell>
                    <TableCell>Местоположение</TableCell>
                    <TableCell>Отрасль</TableCell>
                    <TableCell>Зарплата</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.industry}</TableCell>
                      <TableCell>
                        {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} ₽
                      </TableCell>
                      <TableCell>
                        <ButtonGroup variant="outlined" size="small">
                          <Button
                            onClick={() => navigate(`/jobs/${job.id}`)}
                          >
                            Подробнее
                          </Button>
                          <Button
                            onClick={() => navigate(`/jobs/${job.id}/applications`)}
                          >
                            Отклики
                          </Button>
                          <Button
                            color="error"
                            onClick={() => handleDeleteClick(job)}
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

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
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
            Вы уверены, что хотите удалить вакансию "{jobToDelete?.title}"?
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
    </Container>
  );
};

export default EmployerJobsList; 