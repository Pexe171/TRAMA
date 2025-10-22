import { api } from '../../../services/api/apiClient';
import { HomeData } from '../types';

export const fetchHome = () => api.getHome<HomeData>();
