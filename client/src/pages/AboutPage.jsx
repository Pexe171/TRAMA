import { useCallback, useEffect, useState } from 'react';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { api } from '../services/apiClient';

const AboutPage = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarPagina = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getAboutPage();
      setPage(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPagina();
  }, [carregarPagina]);

  return (
    <div className="page about-page">
      <section className="page-hero about-hero">
        <div className="container">
          {loading ? (
            <LoadingState message="Carregando nossa história..." />
          ) : error ? (
            <ErrorState error={error} onRetry={carregarPagina} />
          ) : page ? (
            <>
              <p className="page-kicker">Nossa essência</p>
              <h1>{page.title || 'Quem Somos'}</h1>
              <p className="page-summary">
                A TRAMA RP nasce para unir universos — do cinema à comunicação, do roleplay às narrativas que nos movem.
              </p>
            </>
          ) : null}
        </div>
      </section>

      {!loading && !error && page ? (
        <section className="container article-content" dangerouslySetInnerHTML={{ __html: page.content }} />
      ) : null}
    </div>
  );
};

export default AboutPage;
