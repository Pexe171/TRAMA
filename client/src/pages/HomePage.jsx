import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ArticleCard from '../components/ArticleCard';
import { api } from '../services/apiClient';
import { extractSummary, getArticlePrimaryDate, resolveCoverImage } from '../utils/article';
import { formatDate } from '../utils/format';

// Usando a imagem de cabeçalho que você enviou
const HERO_IMAGE_URL = 'https://i.postimg.cc/1X4F24xN/image-a59b47.jpg';

const buildArticlePath = (article) => {
  const editoriaSlug = article?.editoriaId?.slug;
  if (!editoriaSlug || !article?.slug) {
    return null;
  }
  return `/editorias/${editoriaSlug}/artigos/${article.slug}`;
};

const HomePage = () => {
  const [homeData, setHomeData] = useState({ articles: [], latestEditoria: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarConteudo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [homePayload, latestEditoriaPayload] = await Promise.all([
        api.getHomeData(),
        api.getLatestEditoria(),
      ]);
      setHomeData({
        articles: Array.isArray(homePayload?.ultimasPostagens) ? homePayload.ultimasPostagens : [],
        latestEditoria: latestEditoriaPayload || null,
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarConteudo();
  }, [carregarConteudo]);

  const { articles, latestEditoria } = homeData;
  const destaque = useMemo(() => (articles.length > 0 ? articles[0] : null), [articles]);
  const demaisArtigos = useMemo(() => (articles.length > 1 ? articles.slice(1) : []), [articles]);

  const destaquePath = buildArticlePath(destaque);
  const destaqueResumo = destaque ? extractSummary(destaque, 260) : '';
  const destaqueData = destaque ? formatDate(getArticlePrimaryDate(destaque)) : '';

  return (
    <div className="page home-page">
      {/* Botão de acessar movido para o Layout global */}
      
      {/* Imagem de cabeçalho fixa */}
      <section
        className="hero-section"
        style={{ backgroundImage: `linear-gradient(120deg, rgba(4, 7, 16, 0.92), rgba(4, 7, 16, 0.6)), url(${HERO_IMAGE_URL})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content container">
          {loading && !destaque ? (
            <LoadingState message="Buscando novidades..." />
          ) : error ? (
            <ErrorState error={error} onRetry={carregarConteudo} />
          ) : destaque ? (
            <>
              <p className="hero-kicker">Em destaque: {destaque?.editoriaId?.title || 'Conteúdo'}</p>
              <h1>{destaque?.title}</h1>
              <p className="hero-summary">{destaqueResumo}</p>
              <div className="hero-meta">
                <span>{destaqueData}</span>
                {destaque?.stats?.views ? <span>{destaque.stats.views} visualizaç{destaque.stats.views > 1 ? 'ões' : 'ão'}</span> : null}
              </div>
              {destaquePath && (
                <div className="hero-actions">
                  <Link className="primary-button" to={destaquePath}>
                    Ler matéria completa
                  </Link>
                </div>
              )}
            </>
          ) : (
             <>
              <h1>Bem-vindo(a) ao TRAMA</h1>
              <p className="hero-summary">
                Onde cinema encontra estratégia. Explore nossas editorias e mergulhe em análises profundas.
              </p>
            </>
          )}
        </div>
      </section>

      {!loading && !error && demaisArtigos.length > 0 && (
        <section className="container section">
          <div className="section-header">
            <h2>Últimas Matérias</h2>
          </div>
          <div className="article-grid">
            {demaisArtigos.map((article) => (
              <ArticleCard key={article._id || article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Seção "Você não pode perder" */}
      {!loading && latestEditoria && (
        <section className="container section">
          <div className="section-header">
            <h2>Você não pode perder</h2>
          </div>
          <div className="article-card">
             <div className="article-card-image" style={{ backgroundImage: `url(${resolveCoverImage(latestEditoria.coverImage)})` }} aria-hidden="true" />
             <div className="article-card-body">
                <p className="article-card-editoria">Última Editoria Publicada</p>
                <h3>{latestEditoria.title}</h3>
                <p className="article-card-summary">{latestEditoria.description || 'Explore os artigos desta editoria.'}</p>
                <Link className="link-button" to={`/editorias/${latestEditoria.slug}`}>
                    Ver editoria
                </Link>
             </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
