import { login, register } from 'services/api/apiClient';
import { AuthResponse, LoginPayload, RegisterPayload } from './types';

export const loginRequest = (payload: LoginPayload) =>
  login<AuthResponse>(payload);

export const registerRequest = (payload: RegisterPayload) =>
  register<AuthResponse>(payload);
