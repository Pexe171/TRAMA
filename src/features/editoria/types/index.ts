import { ArticleSummary } from '../../home/types';

export type Editoria = {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
};

export type EditoriaDetails = Editoria & {
  heroImage: string;
  articles: ArticleSummary[];
  currentPage: number;
  totalPages: number;
};
