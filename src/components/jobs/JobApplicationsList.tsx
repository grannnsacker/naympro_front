import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  ButtonGroup,
  Tooltip,
} from '@mui/material';
import { getEmployerApplications, getJobDetails, updateApplicationStatus, notifyJobApplication } from '../../services/api';
import { RootState } from '../../store';
import { Job, JobApplicationEmployer } from '../../types';

const JobApplicationsList: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, userType } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState<JobApplicationEmployer[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!isAuthenticated || userType !== 'employer') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        if (id) {
          const [jobData, applicationsData] = await Promise.all([
            getJobDetails(parseInt(id)),
            getEmployerApplications(parseInt(id), page, pageSize)
          ]);
          
          setJob(jobData);
          setApplications(applicationsData || []);
          setTotalPages(Math.ceil((applicationsData.length || 0) / pageSize));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, page, isAuthenticated, userType, navigate]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleStatusChange = async (applicationId: number, newStatus: 'Interviewing' | 'Offered' | 'Rejected') => {
    setUpdating(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      // Send notification about status change
      await notifyJobApplication({
        application_id: applicationId,
        status: newStatus
      });
      // Refresh the applications list
      if (id) {
        const updatedApplications = await getEmployerApplications(parseInt(id), page, pageSize);
        setApplications(updatedApplications);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!job) {
    return (
      <Container>
        <Typography>Job not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/jobs/${id}`)}
            sx={{ mb: 2 }}
          >
            Назад к вакансии
          </Button>
          <Typography variant="h4" gutterBottom>
            Отклики на вакансию {job.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {job.company_name}
          </Typography>
        </Box>

        {applications.length === 0 ? (
          <Typography>Пока нет откликов</Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Работник</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Дата отклика</TableCell>
                    <TableCell>Резюме</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.application_id}>
                      <TableCell>{application.user_full_name}</TableCell>
                      <TableCell>{application.user_email}</TableCell>
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
                        {new Date(application.application_date).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          size="small"
                          href={`http://localhost:8080/assets/cvs/cv_${application.application_id}.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Просмотр
                        </Button>
                      </TableCell>
                      <TableCell>
                        <ButtonGroup size="small" variant="outlined">
                          <Tooltip title="Пригласить на собеседование">
                            <Button
                              color="primary"
                              onClick={() => handleStatusChange(application.application_id, 'Interviewing')}
                              disabled={updating === application.application_id || application.application_status === 'Interviewing'}
                            >
                              Собеседование
                            </Button>
                          </Tooltip>
                          <Tooltip title="Сделать предложение">
                            <Button
                              color="success"
                              
                              onClick={() => handleStatusChange(application.application_id, 'Offered')}
                              disabled={updating === application.application_id || application.application_status === 'Offered'}
                            >
                              Предложить
                            </Button>
                          </Tooltip>
                          <Tooltip title="Отказать">
                            <Button
                              color="error"
                              onClick={() => handleStatusChange(application.application_id, 'Rejected')}
                              disabled={updating === application.application_id || application.application_status === 'Rejected'}
                            >
                              Отказать
                            </Button>
                          </Tooltip>
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
    </Container>
  );
};

export default JobApplicationsList; 