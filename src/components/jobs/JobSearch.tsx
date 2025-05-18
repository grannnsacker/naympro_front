import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Pagination,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  IconButton,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { searchJobs } from '../../services/api';
import { Job } from '../../types';

const JobSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[] | null>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    job_location: '',
    salary_min: '',
    salary_max: '',
  });
  const [customIndustry, setCustomIndustry] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [showCustomIndustry, setShowCustomIndustry] = useState(false);
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const pageSize = 10;

  const fetchJobs = async (query: string = '', currentPage: number = 1) => {
    setLoading(true);
    try {
      const filterParams = {
        ...filters,
        salary_min: filters.salary_min ? parseInt(filters.salary_min) : undefined,
        salary_max: filters.salary_max ? parseInt(filters.salary_max) : undefined,
      };

      const response = await searchJobs(query, currentPage, pageSize, filterParams);
      const jobsArray = response || [];
      const uniqueJobs = Array.from(
        new Map(jobsArray.map((job: Job) => [job.id, job])).values()
      );
      setJobs(uniqueJobs);
      
      const isLastPageFull = uniqueJobs.length === pageSize;
      if (currentPage === 1 && !isLastPageFull) {
        setTotalPages(1);
      } else if (isLastPageFull) {
        setTotalPages(currentPage + 1);
      } else {
        setTotalPages(currentPage);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(searchQuery, page);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchJobs(searchQuery, 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (field: string) => (event: any) => {
    const value = event.target.value;
    
    if (field === 'industry') {
      if (value === 'custom') {
        setShowCustomIndustry(true);
        setFilters(prev => ({ ...prev, industry: customIndustry }));
      } else {
        setShowCustomIndustry(false);
        setCustomIndustry('');
        setFilters(prev => ({ ...prev, industry: value }));
      }
    } else if (field === 'job_location') {
      if (value === 'custom') {
        setShowCustomLocation(true);
        setFilters(prev => ({ ...prev, job_location: customLocation }));
      } else {
        setShowCustomLocation(false);
        setCustomLocation('');
        setFilters(prev => ({ ...prev, job_location: value }));
      }
    } else {
      setFilters(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCustomInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (field === 'industry') {
      setCustomIndustry(value);
      setFilters(prev => ({ ...prev, industry: value }));
    } else if (field === 'job_location') {
      setCustomLocation(value);
      setFilters(prev => ({ ...prev, job_location: value }));
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Поиск вакансий..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{ mb: 3 }}
            >
              Найти
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => setShowFilters(!showFilters)}>
            <FilterListIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Фильтры
          </Typography>
        </Box>

        <Collapse in={showFilters}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Отрасль</InputLabel>
                <Select
                  value={showCustomIndustry ? 'custom' : filters.industry}
                  onChange={handleFilterChange('industry')}
                  label="Отрасль"
                >
                  <MenuItem value="">Все отрасли</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Finance">Финансы</MenuItem>
                  <MenuItem value="Marketing">Маркетинг</MenuItem>
                  <MenuItem value="Sales">Продажи</MenuItem>
                  <MenuItem value="custom">Свой вариант</MenuItem>
                </Select>
              </FormControl>
              {showCustomIndustry && (
                <TextField
                  fullWidth
                  value={customIndustry}
                  onChange={handleCustomInputChange('industry')}
                  placeholder="Введите отрасль"
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Локация</InputLabel>
                <Select
                  value={showCustomLocation ? 'custom' : filters.job_location}
                  onChange={handleFilterChange('job_location')}
                  label="Локация"
                >
                  <MenuItem value="">Все локации</MenuItem>
                  <MenuItem value="Moscow">Москва</MenuItem>
                  <MenuItem value="Saint Petersburg">Санкт-Петербург</MenuItem>
                  <MenuItem value="Remote">Удаленно</MenuItem>
                  <MenuItem value="custom">Свой вариант</MenuItem>
                </Select>
              </FormControl>
              {showCustomLocation && (
                <TextField
                  fullWidth
                  value={customLocation}
                  onChange={handleCustomInputChange('job_location')}
                  placeholder="Введите локацию"
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Мин. зарплата"
                type="number"
                value={filters.salary_min}
                onChange={handleFilterChange('salary_min')}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₽</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Макс. зарплата"
                type="number"
                value={filters.salary_max}
                onChange={handleFilterChange('salary_max')}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₽</Typography>,
                }}
              />
            </Grid>
          </Grid>
        </Collapse>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : jobs && jobs.length > 0 ? (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {job.company_name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Местоположение: {job.location}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Зарплата: {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} ₽
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      Подробнее
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" align="center" sx={{ my: 4 }}>
          Вакансии не найдены
        </Typography>
      )}

      {totalPages > 1 && (
        <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default JobSearch; 