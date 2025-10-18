import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EditoriaPage from './pages/EditoriaPage';
import ArticlePage from './pages/ArticlePage';
import AboutPage from './pages/AboutPage';
import { api } from './services/apiClient';

function App() {
  const [editorias, setEditorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarEditorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEditorias();
      setEditorias(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarEditorias();
  }, [carregarEditorias]);

  return (
    // O <Router> foi removido daqui, pois já está em index.js
    <Layout
      editorias={editorias}
      editoriasLoading={loading}
      editoriasError={error}
      onReloadEditorias={carregarEditorias}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quem-somos" element={<AboutPage />} />
        <Route path="/editorias/:slug" element={<EditoriaPage />} />
        <Route path="/editorias/:editoriaSlug/artigos/:articleSlug" element={<ArticlePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
