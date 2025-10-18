const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80';

export const getArticlePrimaryDate = (article) => {
  if (!article) {
    return null;
  }

  return article.publishedAt || article.createdAt || null;
};

export const extractSummary = (article, length = 220) => {
  if (!article) {
    return 'Conteúdo em construção. Volte em breve!';
  }

  if (article.summary && article.summary.trim()) {
    return article.summary.trim();
  }

  if (article.content) {
    const text = article.content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (text) {
      return text.length > length ? `${text.slice(0, length).trim()}…` : text;
    }
  }

  return 'Conteúdo em construção. Volte em breve!';
};

export const resolveCoverImage = (coverImage) => {
  if (!coverImage) {
    return PLACEHOLDER_IMAGE;
  }

  if (/^https?:/i.test(coverImage) || coverImage.startsWith('data:')) {
    return coverImage;
  }

  if (coverImage.startsWith('/')) {
    return coverImage;
  }

  return `/${coverImage}`;
};

export const resolveAvatarFallback = (name) => {
  if (!name) {
    return '👤';
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return '👤';
  }

  const words = trimmed.split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  const initials = `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`;
  return initials.toUpperCase();
};
