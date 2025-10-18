import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { extractSummary, getArticlePrimaryDate, resolveCoverImage } from '../utils/article';
import { formatDate } from '../utils/format';

const buildArticlePath = (article) => {
  const editoriaSlug = article?.editoriaId?.slug;
  if (!editoriaSlug || !article?.slug) {
    return null;
  }

  return `/editorias/${editoriaSlug}/artigos/${article.slug}`;
};

const ArticleCard = ({ article }) => {
  const articlePath = buildArticlePath(article);
  const coverImage = resolveCoverImage(article?.coverImage);
  const summary = extractSummary(article);
  const primaryDate = getArticlePrimaryDate(article);
  const formattedDate = formatDate(primaryDate);
  const ratingsAvg = article?.stats?.ratingsAvg || 0;
  const ratingsCount = article?.stats?.ratingsCount || 0;

  return (
    <article className="article-card">
      <div className="article-card-image" style={{ backgroundImage: `url(${coverImage})` }} aria-hidden="true" />
      <div className="article-card-body">
        <p className="article-card-editoria">{article?.editoriaId?.title || 'Conteúdo'}</p>
        <h3>{article?.title || 'Título em definição'}</h3>
        <p className="article-card-summary">{summary}</p>
        <div className="article-card-meta">
          <span>{formattedDate}</span>
          {ratingsCount > 0 ? (
            <span>
              ⭐ {ratingsAvg.toFixed(1)} • {ratingsCount} avaliação{ratingsCount > 1 ? 'es' : ''}
            </span>
          ) : null}
        </div>
        {articlePath ? (
          <Link className="link-button" to={articlePath} aria-label={`Abrir matéria ${article?.title}`}>
            Ler matéria
          </Link>
        ) : (
          <span className="link-button is-disabled" aria-disabled="true">
            Link indisponível
          </span>
        )}
      </div>
    </article>
  );
};

ArticleCard.propTypes = {
  article: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    slug: PropTypes.string,
    summary: PropTypes.string,
    coverImage: PropTypes.string,
    publishedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    editoriaId: PropTypes.shape({
      slug: PropTypes.string,
      title: PropTypes.string,
    }),
    stats: PropTypes.shape({
      ratingsAvg: PropTypes.number,
      ratingsCount: PropTypes.number,
    }),
  }).isRequired,
};

export default ArticleCard;
