export const formatDate = (value, options = {}) => {
  if (!value) {
    return 'Data não informada';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Data não informada';
  }

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  });

  return formatter.format(date);
};

export const formatErrorMessage = (error, fallback = 'Algo inesperado aconteceu. Tente novamente.') => {
  if (!error) {
    return fallback;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === 'object' && error.message) {
    return error.message;
  }

  return fallback;
};
