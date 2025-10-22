import { api } from 'services/api/apiClient';
import { AuthResponse, LoginPayload, RegisterPayload } from './types';

export const loginRequest = (payload: LoginPayload) =>
  api.login<AuthResponse>(payload);

export const registerRequest = (payload: RegisterPayload) =>
  api.register<AuthResponse>(payload);
