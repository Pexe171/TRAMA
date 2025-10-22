export type ProfileArticle = {
  id: string;
  title: string;
  slug: string;
  editoriaSlug: string;
  editoriaTitle: string;
  coverImage: string;
  savedAt: string;
};

export type ProfileHistoryItem = ProfileArticle & {
  lastViewedAt: string;
};
