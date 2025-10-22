export const formatDate = (dateIso: string) => {
  try {
    const date = new Date(dateIso);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    return dateIso;
  }
};
