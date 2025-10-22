export type ArticleContent = {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  editoria: {
    slug: string;
    title: string;
  };
  author: {
    name: string;
    avatarUrl?: string;
  };
  publishedAt: string;
  viewCount: number;
};
