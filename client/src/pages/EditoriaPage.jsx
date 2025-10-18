import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { api } from '../services/apiClient';
import { resolveCoverImage } from '../utils/article';

const EditoriaPage = () => {
  const { slug } = useParams();
  const [editoria, setEditoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarEditoria = useCallback(async () => {
    if (!slug) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.getEditoriaBySlug(slug);
      setEditoria(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    carregarEditoria();
  }, [carregarEditoria]);

  const headerImage = resolveCoverImage(editoria?.coverImage);
  const artigos = editoria?.articles || [];

  return (
    <div className="page editoria-page">
      <section className="page-hero" style={{ backgroundImage: `linear-gradient(120deg, rgba(4, 7, 16, 0.94), rgba(4, 7, 16, 0.65)), url(${headerImage})` }}>
        <div className="container">
          {loading ? (
            <LoadingState message="Carregando editoria..." />
          ) : error ? (
            <ErrorState error={error} onRetry={carregarEditoria} />
          ) : editoria ? (
            <>
              <p className="page-kicker">Editoria</p>
              <h1>{editoria.title}</h1>
              <p className="page-summary">
                {editoria.description || 'Em breve, mais detalhes sobre esta editoria especial do universo TRAMA.'}
              </p>
            </>
          ) : (
            <ErrorState message="Editoria não encontrada." />
          )}
        </div>
      </section>

      {!loading && !error && editoria ? (
        <section className="container section">
          {artigos.length > 0 ? (
            <div className="article-grid">
              {artigos.map((article) => (
                <ArticleCard key={article._id || article.slug} article={article} />
              ))}
            </div>
          ) : (
            <p className="empty-state">Ainda não publicamos matérias nesta editoria. Volte em breve!</p>
          )}
        </section>
      ) : null}
    </div>
  );
};

export default EditoriaPage;
