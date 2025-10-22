import { getEditoriaBySlug, getEditorias } from 'services/api/apiClient';
import { Editoria, EditoriaDetails } from '../types';

export const fetchEditorias = () => getEditorias<Editoria[]>();

export const fetchEditoriaDetails = (slug: string, page = 1) =>
  getEditoriaBySlug<EditoriaDetails>(slug, { page });
