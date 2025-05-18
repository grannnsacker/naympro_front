import axios from 'axios';
import { AuthResponse, Job, LoginRequest, RegisterEmployerRequest, RegisterUserRequest, JobApplication, CreateJobRequest, User, Employer, ChangeNotifyJobApplicationRequest, UpdateUserRequest, UpdateEmployerRequest, JobApplicationEmployer } from '../types';

const API_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post('/users/login', data);
  return response.data;
};

export const loginEmployer = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post('/employers/login', data);
  return response.data;
};

export const registerUser = async (data: RegisterUserRequest): Promise<User> => {
  const response = await api.post('/users', data);
  return response.data;
};

export const registerEmployer = async (data: RegisterEmployerRequest): Promise<AuthResponse> => {
  const response = await api.post('/employers', data);
  return response.data;
};

export const getAllJobs = async (page: number = 1, pageSize: number = 10): Promise<Job[]> => {
  const response = await api.get<Job[]>('/jobs', {
    params: { page, page_size: pageSize },
  });
  return response.data;
};

export const searchJobs = async (
  query: string = '',
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    title?: string;
    industry?: string;
    job_location?: string;
    salary_min?: number;
    salary_max?: number;
  }
): Promise<Job[]> => {
  const params: any = {
    page,
    page_size: pageSize,
    ...filters
  };

  if (query.trim()) {
    params.title = query;
  }

  const response = await api.get<Job[]>('/jobs', { params });
  return response.data;
};

export const getJobDetails = async (id: number): Promise<Job> => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const applyForJob = async (jobId: number, message: string, cv: File): Promise<JobApplication> => {
  const formData = new FormData();
  formData.append('job_id', jobId.toString());
  formData.append('message', message);
  formData.append('cv', cv);

  const response = await api.post('/job-applications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getUserApplications = async (page: number = 1, pageSize: number = 10) => {
  const response = await api.get('/job-applications/user', {
    params: { page, page_size: pageSize },
  });
  return response.data;
};

export const getEmployerApplications = async (jobId: number, page: number = 1, pageSize: number = 10): Promise<JobApplicationEmployer[]> => {
  const response = await api.get<JobApplicationEmployer[]>('/job-applications/employer', {
    params: { job_id: jobId, page, page_size: pageSize },
  });
  const uniqueApplications = Array.from(
    new Map(response.data.map((item: JobApplicationEmployer) => [item.application_id, item])).values()
  );

  return uniqueApplications;
};

export const createJobVacancy = async (data: CreateJobRequest): Promise<Job> => {
  const response = await api.post('/jobs', data);
  return response.data;
};

export const applyToJob = async (jobId: number, message: string, cv: File): Promise<JobApplication> => {
  const formData = new FormData();
  formData.append('job_id', jobId.toString());
  formData.append('message', message);
  formData.append('cv', cv);

  const response = await api.post('/job-applications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getUserApplicationById = async (applicationId: number) => {
  const response = await api.get(`/job-applications/user/${applicationId}`);
  return response.data;
};

export const getEmployerJobs = async (page: number = 1, pageSize: number = 10) => {
  const response = await api.get('/jobs/employer', {
    params: { page, page_size: pageSize },
  });
  return response.data;
};

export const deleteJob = async (jobId: number) => {
  const response = await api.delete(`/jobs/${jobId}`);
  return response.data;
};

export const deleteApplication = async (applicationId: number) => {
  const response = await api.delete(`/job-applications/user/${applicationId}`);
  return response.data;
};

export const updateApplicationStatus = async (applicationId: number, newStatus: 'Interviewing' | 'Offered' | 'Rejected') => {
  const response = await api.patch(`/job-applications/employer/${applicationId}/status`, {
    new_status: newStatus
  });
  return response.data;
}; 

export const getUserProfile = async (): Promise<User> => {
  const response = await api.get('/users');
  return response.data;
};

export const getEmployerProfile = async (): Promise<Employer> => {
  const response = await api.get('/employers');
  return response.data;
};


export const changeNotifyJobApplication = async (data: ChangeNotifyJobApplicationRequest) => {
  const response = await api.post('/job-applications/user/notifications/', data);
  return response.data;
};

export const updateUser = async (data: UpdateUserRequest): Promise<User> => {
  const response = await api.patch('/users', data);
  return response.data;
};

export const updateEmployer = async (data: UpdateEmployerRequest): Promise<Employer> => {
  const response = await api.patch('/employers', data);
  return response.data;
};

export const notifyJobApplication = async (data: { application_id: number, status: string }) => {
  const response = await api.post('/job-applications/notification', data);
  return response.data;
};

export const updateJob = async (id: number, data: Partial<Job>) => {
  const response = await api.patch(`/jobs/${id}`, data);
  return response.data;
};