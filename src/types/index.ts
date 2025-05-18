export interface User {
  created_at: string;
  desired_industry: string;
  desired_job_title: string;
  desired_salary_max: number;
  desired_salary_min: number;
  email: string;
  experience: string;
  full_name: string;
  location: string;
  skills: UserSkill[];
  skills_description: string;
  telegram_id: string;
}

export interface Employer {
  company_id: number;
  company_industry: string;
  company_location: string;
  company_name: string;
  email: string;
  employer_created_at: string;
  employer_id: number;
  full_name: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  industry: string;
  location: string;
  required_skills: Skill[];
  requirements: string;
  salary_max: number;
  salary_min: number;
  company_name: string;
  company_id: number;
  created_at: string;
}

export interface Skill {
  id: number;
  skill: string;
  years_of_experience?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterUserRequest {
  email: string;
  password: string;
  full_name: string;
  location: string;
  desired_industry: string;
  desired_job_title: string;
  desired_salary_min: number;
  desired_salary_max: number;
  experience?: string;
  skills?: Skill[];
  skills_description?: string;
  telegram_id: string;
}

export interface RegisterEmployerRequest {
  email: string;
  password: string;
  full_name: string;
  company_name: string;
  company_industry: string;
  company_location: string;
}

export interface JobApplication {
  id: number;
  job_id: number;
  message?: string;
  status: 'Applied' | 'Seen' | 'Interviewing' | 'Offered' | 'Rejected';
  applied_at: string;
  user?: {
    full_name: string;
    email: string;
  };
  cv_url: string;
}

export interface JobApplicationEmployer {
  application_id: number;
  user_id: number;
  user_email: string;
  user_full_name: string;
  application_status: 'Applied' | 'Seen' | 'Interviewing' | 'Offered' | 'Rejected';
  application_date: string;
}

export interface JobApplicationUser {
  user_id: number;
  application_id: number;
  job_title: string;
  job_id: number;
  company_name: string;
  application_status: 'Applied' | 'Seen' | 'Interviewing' | 'Offered' | 'Rejected';
  application_date: string;
}

export interface AuthResponse {
  access_token: string;
  user?: User;
  employer?: Employer;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  requirements: string;
  industry: string;
  location: string;
  salary_min: number;
  salary_max: number;
  required_skills: string[];
}

export interface UserSkill {
  id: number;
  skill: string;
  years_of_experience: number;
}

export interface ChangeNotifyJobApplicationRequest {
  id: number;
  notification: boolean;
}

export interface UpdateUserRequest {
  full_name?: string;
  location?: string;
  desired_job_title?: string;
  desired_industry?: string;
  desired_salary_min?: number;
  desired_salary_max?: number;
  experience?: string;
  skills_description?: string;
}

export interface UpdateEmployerRequest {
  full_name?: string;
  company_name?: string;
  company_industry?: string;
  company_location?: string;
} 