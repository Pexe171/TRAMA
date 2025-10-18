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
    </div>
  </div>
);

function App() {
  return <IntroPage />;
}

export default App;
