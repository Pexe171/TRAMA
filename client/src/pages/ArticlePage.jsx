import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { api } from '../services/apiClient';
import { extractSummary, resolveAvatarFallback, resolveCoverImage } from '../utils/article';
import { formatDate } from '../utils/format';

const ArticlePage = () => {
  const { editoriaSlug, articleSlug } = useParams();
  const [article, setArticle] = useState(null);
  const [articleLoading, setArticleLoading] = useState(true);
  const [articleError, setArticleError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  const carregarArtigo = useCallback(async () => {
    if (!editoriaSlug || !articleSlug) {
      return;
    }

    setArticleLoading(true);
    setArticleError(null);

    try {
      const data = await api.getArticleBySlug(editoriaSlug, articleSlug);
      setArticle(data);
    } catch (err) {
      setArticleError(err);
    } finally {
      setArticleLoading(false);
    }
  }, [editoriaSlug, articleSlug]);

  const carregarComentarios = useCallback(async () => {
    if (!articleSlug) {
      return;
    }

    setCommentsLoading(true);
    setCommentsError(null);

    try {
      const data = await api.getArticleComments(articleSlug);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      setCommentsError(err);
    } finally {
      setCommentsLoading(false);
    }
  }, [articleSlug]);

  useEffect(() => {
    carregarArtigo();
  }, [carregarArtigo]);

  useEffect(() => {
    carregarComentarios();
  }, [carregarComentarios]);

  if (articleLoading) {
    return (
      <div className="page article-page">
        <LoadingState message="Carregando matéria..." />
      </div>
    );
  }

  if (articleError) {
    return (
      <div className="page article-page">
        <ErrorState error={articleError} onRetry={carregarArtigo} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="page article-page">
        <ErrorState message="Não encontramos a matéria que você procurou." />
      </div>
    );
  }

  const editoriaTitle = article?.editoriaId?.title || 'Matéria';
  const editoriaPath = article?.editoriaId?.slug ? `/editorias/${article.editoriaId.slug}` : null;
  const coverImage = resolveCoverImage(article?.coverImage);
  const publishedDate = formatDate(article?.publishedAt || article?.createdAt);
  const ratingsAvg = article?.stats?.ratingsAvg || 0;
  const ratingsCount = article?.stats?.ratingsCount || 0;
  const commentsCount = article?.stats?.commentsCount || 0;

  return (
    <article className="page article-page">
      <header className="article-hero" style={{ backgroundImage: `linear-gradient(120deg, rgba(4, 7, 16, 0.95), rgba(4, 7, 16, 0.6)), url(${coverImage})` }}>
        <div className="container">
          <div className="article-hero-content">
            {editoriaPath ? (
              <Link className="badge-link" to={editoriaPath}>
                {editoriaTitle}
              </Link>
            ) : (
              <span className="badge-link" aria-hidden="true">
                {editoriaTitle}
              </span>
            )}
            <h1>{article.title}</h1>
            <p className="article-hero-summary">{extractSummary(article, 200)}</p>
            <div className="article-meta">
              <span>{publishedDate}</span>
              {article?.authorId?.displayName ? <span>Por {article.authorId.displayName}</span> : null}
              {article?.stats?.views ? (
                <span>{article.stats.views} visualizaç{article.stats.views > 1 ? 'ões' : 'ão'}</span>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <section className="container article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

      <section className="container article-stats">
        <h2>Avaliações da comunidade</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{ratingsCount > 0 ? ratingsAvg.toFixed(1) : '—'}</span>
            <span className="stat-label">Média de estrelas</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{ratingsCount}</span>
            <span className="stat-label">Total de avaliações</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{commentsCount}</span>
            <span className="stat-label">Comentários publicados</span>
          </div>
        </div>
        <p className="stat-note">
          Para avaliar e comentar diretamente, autentique-se em nosso servidor principal TRAMA RP. A experiência completa te espera lá!
        </p>
      </section>

      <section className="container comments-section">
        <div className="comments-header">
          <h2>Comentários recentes</h2>
          {commentsError ? <ErrorState compact error={commentsError} onRetry={carregarComentarios} /> : null}
        </div>
        {commentsLoading ? (
          <LoadingState message="Carregando comentários..." />
        ) : comments.length > 0 ? (
          <ul className="comments-list">
            {comments.map((comment) => {
              const displayName = comment?.authorId?.displayName || comment?.authorId?.username || 'Leitor anônimo';
              const avatarLetter = resolveAvatarFallback(displayName);
              return (
                <li key={comment._id} className="comment-item">
                  <div className="comment-avatar" aria-hidden="true">
                    {comment?.authorId?.avatarUrl ? (
                      <img src={resolveCoverImage(comment.authorId.avatarUrl)} alt="Avatar do leitor" />
                    ) : (
                      <span>{avatarLetter}</span>
                    )}
                  </div>
                  <div className="comment-body">
                    <div className="comment-meta">
                      <span className="comment-author">{displayName}</span>
                      <span className="comment-date">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="empty-state">Ainda não há comentários por aqui. Que tal ser o primeiro a compartilhar sua opinião?</p>
        )}
      </section>
    </article>
  );
};

export default ArticlePage;
