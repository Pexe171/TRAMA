import { api } from 'services/api/apiClient';
import { Editoria, EditoriaDetails } from '../types';

export const fetchEditorias = () => api.getEditorias<Editoria[]>();

export const fetchEditoriaDetails = (slug: string, page = 1) =>
  api.getEditoriaBySlug<EditoriaDetails>(slug, { page });
