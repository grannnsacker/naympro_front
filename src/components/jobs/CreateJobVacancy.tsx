import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Stack,
  InputAdornment,
  Alert,
} from '@mui/material';
import { RootState } from '../../store';
import { createJobVacancy } from '../../services/api';

const CreateJobVacancy: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useSelector((state: RootState) => state.auth);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    industry: '',
    location: '',
    salary_min: '',
    salary_max: '',
  });

  // Redirect if not authenticated or not an employer
  React.useEffect(() => {
    if (!isAuthenticated || userType !== 'employer') {
      navigate('/login');
    }
  }, [isAuthenticated, userType, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const jobData = {
        ...formData,
        salary_min: parseInt(formData.salary_min),
        salary_max: parseInt(formData.salary_max),
        required_skills: skills,
      };

      await createJobVacancy(jobData);
      setSuccess('Вакансия успешно создана!');
 
      setFormData({
        title: '',
        description: '',
        requirements: '',
        industry: '',
        location: '',
        salary_min: '',
        salary_max: '',
      });
      setSkills([]);
      
      // Redirect to jobs list after a short delay
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
    } catch (error) {
      setError('Failed to create job vacancy. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Создать вакансию
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Название"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Область"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Локация"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Мин. заработная плата"
              name="salary_min"
              type="number"
              value={formData.salary_min}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">₽</InputAdornment>,
              }}
            />
            <TextField
              label="Макс. заработная плата"
              name="salary_max"
              type="number"
              value={formData.salary_max}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">₽</InputAdornment>,
              }}
            />
          </Box>

          <TextField
            fullWidth
            label="Описание"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Требования"
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            required
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Введите навык"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button variant="contained" onClick={handleAddSkill}>
                Добавить навык
              </Button>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Stack>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Создать
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateJobVacancy; 