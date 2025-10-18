import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { api } from '../services/apiClient';
import { resolveCoverImage } from '../utils/article';

const BANNER_BACKGROUND_URL = 'https://i.postimg.cc/W1g4gPZT/image-a59b47.jpg';
// NOTA: Esta é uma imagem temporária para o logo. Substitua pelo URL da sua imagem.
const TRAMA_LOGO_URL = 'https://i.postimg.cc/rpTTsM0p/trama-logo-placeholder.png';
const ABOUT_US_IMAGE_URL = 'https://i.postimg.cc/k5Pbmwch/IMG-1758.jpg';

// Dados de exemplo para a equipe. No futuro, virão da sua API.
const mockTeamMembers = [
  {
    _id: '1',
    name: 'Nome do Integrante',
    favoriteMovie: 'Filme Favorito',
    imageUrl: 'https://placehold.co/200x200/222326/FFF?text=Foto',
  },
  {
    _id: '2',
    name: 'Outro Integrante',
    favoriteMovie: 'Outro Filme Incrível',
    imageUrl: 'https://placehold.co/200x200/222326/FFF?text=Foto',
  },
  {
    _id: '3',
    name: 'Mais Um Membro',
    favoriteMovie: 'Um Clássico do Cinema',
    imageUrl: 'https://placehold.co/200x200/222326/FFF?text=Foto',
  },
];

const HomePage = () => {
  const [homeData, setHomeData] = useState({ articles: [], latestEditoria: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // No futuro, você fará uma chamada à API aqui para buscar os integrantes
  const [teamMembers] = useState(mockTeamMembers);

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

  return (
    <div className="page home-page">
      {/* Novo Banner Principal */}
      <section
        className="banner-section"
        style={{ backgroundImage: `url(${BANNER_BACKGROUND_URL})` }}
      >
        <div className="banner-overlay" />
        <img src={TRAMA_LOGO_URL} alt="TRAMA Logo" className="trama-logo-overlay" />
      </section>

      {/* Seção "Você não pode perder" */}
      {!loading && !error && latestEditoria && (
        <section className="container section latest-editoria-section">
          <div className="section-header">
            <h2>Você não pode perder</h2>
          </div>
          <Link to={`/editorias/${latestEditoria.slug}`} className="latest-editoria-card">
            <img src={resolveCoverImage(latestEditoria.coverImage)} alt={latestEditoria.title} />
            <div className="latest-editoria-overlay">
              <h3>{latestEditoria.title}</h3>
            </div>
          </Link>
        </section>
      )}

      {!loading && !error && articles.length > 0 && (
        <section className="container section">
          <div className="section-header">
            <h2>Últimas Matérias</h2>
          </div>
          <div className="article-grid">
            {/* Agora exibe todos os artigos, não apenas os "demais" */}
            {articles.map((article) => (
              <ArticleCard key={article._id || article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Secção "Quem Somos" */}
      <section className="about-us-section container section">
        <div className="section-header">
          <h2>QUEM SOMOS?</h2>
        </div>
        <div className="about-us-content">
          <img src={ABOUT_US_IMAGE_URL} alt="Equipe TRAMA" className="about-us-main-image" />
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member._id} className="team-member-card">
                <img src={member.imageUrl} alt={member.name} className="team-member-photo" />
                <h3 className="team-member-name">{member.name}</h3>
                <p className="team-member-movie">{member.favoriteMovie}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

