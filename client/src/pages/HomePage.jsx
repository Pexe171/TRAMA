import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ArticleCard from '../components/ArticleCard';
import { api } from '../services/apiClient';
import { extractSummary, getArticlePrimaryDate, resolveCoverImage } from '../utils/article';
import { formatDate } from '../utils/format';

const HERO_FALLBACK = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80';

const buildArticlePath = (article) => {
  const editoriaSlug = article?.editoriaId?.slug;
  if (!editoriaSlug || !article?.slug) {
    return null;
  }

  return `/editorias/${editoriaSlug}/artigos/${article.slug}`;
};

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarConteudo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHomeData();
      setArticles(Array.isArray(data?.ultimasPostagens) ? data.ultimasPostagens : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarConteudo();
  }, [carregarConteudo]);

  const destaque = useMemo(() => (articles.length > 0 ? articles[0] : null), [articles]);
  const demaisArtigos = useMemo(() => (articles.length > 1 ? articles.slice(1) : []), [articles]);

  const destaquePath = buildArticlePath(destaque);
  const destaqueImagem = resolveCoverImage(destaque?.coverImage) || HERO_FALLBACK;
  const destaqueResumo = destaque ? extractSummary(destaque, 260) : '';
  const destaqueData = destaque ? formatDate(getArticlePrimaryDate(destaque)) : '';

  return (
    <div className="page home-page">
      <section
        className="hero-section"
        style={{ backgroundImage: `linear-gradient(120deg, rgba(4, 7, 16, 0.92), rgba(4, 7, 16, 0.6)), url(${destaqueImagem || HERO_FALLBACK})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content container">
          {loading ? (
            <LoadingState message="Buscando novidades fresquinhas..." />
          ) : error ? (
            <ErrorState error={error} onRetry={carregarConteudo} />
          ) : destaque ? (
            <>
              <p className="hero-kicker">{destaque?.editoriaId?.title || 'Conteúdo em destaque'}</p>
              <h1>{destaque?.title}</h1>
              <p className="hero-summary">{destaqueResumo}</p>
              <div className="hero-meta">
                <span>{destaqueData}</span>
                {destaque?.stats?.views ? <span>{destaque.stats.views} visualizaç{destaque.stats.views > 1 ? 'ões' : 'ão'}</span> : null}
              </div>
              {destaquePath ? (
                <div className="hero-actions">
                  <Link className="primary-button" to={destaquePath}>
                    Ler matéria completa
                  </Link>
                  <Link className="secondary-button" to="/quem-somos">
                    Conheça o projeto
                  </Link>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <h1>Conteúdos fresquinhos chegando</h1>
              <p className="hero-summary">
                Assim que nossa redação publicar as primeiras matérias, você poderá explorá-las aqui. Enquanto isso, acompanhe as
                novidades nas redes sociais da TRAMA.
              </p>
              <div className="hero-actions">
                <a
                  className="primary-button"
                  href="https://www.instagram.com/tramarp?igsh=NzFiamhxbG53MGl3&utm_source=qr"
                  rel="noreferrer"
                  target="_blank"
                >
                  Instagram
                </a>
                <a className="secondary-button" href="https://www.youtube.com/@TramaRP" rel="noreferrer" target="_blank">
                  YouTube
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {!loading && !error ? (
        <section className="container section">
          <div className="section-header">
            <h2>Últimas matérias</h2>
            <p>Fique por dentro das análises, coberturas e histórias que movimentam o universo TRAMA.</p>
          </div>
          {demaisArtigos.length > 0 ? (
            <div className="article-grid">
              {demaisArtigos.map((article) => (
                <ArticleCard key={article._id || article.slug} article={article} />
              ))}
            </div>
          ) : destaque ? (
            <p className="empty-state">Explore o destaque acima enquanto nossa equipe prepara novas matérias.</p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
};

export default HomePage;
