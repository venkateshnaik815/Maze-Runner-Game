import api from './api';
import type { AuthResponse } from '@/types';
import { LOCAL_STORAGE_KEYS } from '@/constants';

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

const AuthService = {
  /** Register a new player account */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    persistTokens(data);
    return data;
  },

  /** Login with username/email and password */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    persistTokens(data);
    return data;
  },

  /** Refresh the access token using the stored refresh token */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    const { data } = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
    persistTokens(data);
    return data;
  },

  /** Logout and revoke all refresh tokens */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      clearTokens();
    }
  },

  /** Send a password reset email */
  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  /** Complete password reset with token and new password */
  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await api.post('/auth/reset-password', payload);
  },

  /** Verify email address with a verification token */
  async verifyEmail(token: string): Promise<void> {
    await api.get(`/auth/verify-email/${token}`);
  },
};

function persistTokens(auth: AuthResponse): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, auth.access_token);
  localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, auth.refresh_token);
}

function clearTokens(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
}

export default AuthService;
