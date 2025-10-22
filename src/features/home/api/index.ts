import { getHome } from 'services/api/apiClient';
import { HomeData } from '../types';

export const fetchHome = () => getHome<HomeData>();
