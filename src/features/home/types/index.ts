export type HeroContent = {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaUrl?: string;
};

export type AboutBlock = {
  title: string;
  description: string;
  imageUrl: string;
};

export type EditoriaSummary = {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
};

export type ArticleSummary = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  editoriaSlug: string;
  editoriaTitle: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  viewCount: number;
};

export type HomeData = {
  hero: HeroContent;
  about: AboutBlock;
  editorias: EditoriaSummary[];
  latestArticles: ArticleSummary[];
};
