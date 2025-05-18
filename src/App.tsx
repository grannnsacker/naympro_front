import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { store } from './store';
import Header from './components/Header';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import JobSearch from './components/jobs/JobSearch';
import JobDetails from './components/jobs/JobDetails';
import CreateJobVacancy from './components/jobs/CreateJobVacancy';
import JobApplicationsList from './components/jobs/JobApplicationsList';
import UserApplicationsList from './components/jobs/UserApplicationsList';
import EmployerJobsList from './components/jobs/EmployerJobsList';
import UserProfile from './components/profile/UserProfile';
import EmployerProfile from './components/profile/EmployerProfile';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header />
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/jobs/create" element={<CreateJobVacancy />} />
            <Route path="/jobs/:id/applications" element={<JobApplicationsList />} />
            <Route path="/my-applications" element={<UserApplicationsList />} />
            <Route path="/my-jobs" element={<EmployerJobsList />} />
            <Route path="/profile/user" element={<UserProfile />} />
            <Route path="/profile/employer" element={<EmployerProfile />} />
            <Route path="/" element={<Navigate to="/jobs" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 