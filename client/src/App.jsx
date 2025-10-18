import './App.css';

const BACKGROUND_IMAGE_URL = 'https://i.imgur.com/NfP65yq.png';
const LOGO_URL = 'https://i.postimg.cc/xTKKv8pb/Layout-trama-png.png';

const IntroPage = () => (
  <div className="intro-page">
    <div
      className="background-image"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
    />
    <div className="gradient-overlay" />
    <div className="content">
      <img src={LOGO_URL} alt="Logo TRAMA" className="logo" />
      <section className="social-section" aria-labelledby="social-title">
        <h2 id="social-title">Siga a Trama nas redes sociais</h2>
        <p className="social-description">
          Conecte-se com a comunidade e acompanhe as novidades do servidor.
        </p>
        <div className="social-links" role="list">
          <a
            className="social-link instagram"
            href="https://www.instagram.com/tramarp?igsh=NzFiamhxbG53MGl3&utm_source=qr"
            target="_blank"
            rel="noreferrer"
            role="listitem"
          >
            <span aria-hidden="true" className="social-icon">IG</span>
            <span className="social-text">Instagram</span>
          </a>
          <a
            className="social-link youtube"
            href="https://www.youtube.com/@TramaRP"
            target="_blank"
            rel="noreferrer"
            role="listitem"
          >
            <span aria-hidden="true" className="social-icon">▶</span>
            <span className="social-text">YouTube</span>
          </a>
          <a
            className="social-link tiktok"
            href="https://www.tiktok.com/@tramarp?_t=ZM-90WzN02ffDg&_r=1"
            target="_blank"
            rel="noreferrer"
            role="listitem"
          >
            <span aria-hidden="true" className="social-icon">♬</span>
            <span className="social-text">TikTok</span>
          </a>
        </div>
      </section>
    </div>
  </div>
);

function App() {
  return <IntroPage />;
}

export default App;
