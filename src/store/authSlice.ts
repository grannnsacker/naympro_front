import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Employer } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  employer: Employer | null;
  isAuthenticated: boolean;
  userType: 'user' | 'employer' | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
  employer: null,
  isAuthenticated: !!localStorage.getItem('token'),
  userType: localStorage.getItem('userType') as 'user' | 'employer' | null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.userType = 'user';
      localStorage.setItem('userType', 'user');
      localStorage.setItem('token', token);
    },
    setEmployerCredentials: (
      state,
      action: PayloadAction<{ token: string; employer: Employer }>
    ) => {
      const { token, employer } = action.payload;
      state.token = token;
      state.employer = employer;
      state.isAuthenticated = true;
      state.userType = 'employer';
      localStorage.setItem('token', token);
      localStorage.setItem('userType', 'employer');
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.employer = null;
      state.isAuthenticated = false;
      state.userType = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setUserCredentials, setEmployerCredentials, logout } = authSlice.actions;
export default authSlice.reducer; 