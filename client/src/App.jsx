import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import HomePage from './pages/HomePage';
import EditoriaPage from './pages/EditoriaPage';
import ArticlePage from './pages/ArticlePage';
import AboutPage from './pages/AboutPage';
import { api } from './services/apiClient';
import './App.css';

function App() {
  const [editorias, setEditorias] = useState([]);
  const [editoriasLoading, setEditoriasLoading] = useState(true);
  const [editoriasError, setEditoriasError] = useState(null);

  const carregarEditorias = useCallback(async () => {
    setEditoriasLoading(true);
    setEditoriasError(null);
    try {
      const data = await api.getEditorias();
      setEditorias(Array.isArray(data) ? data : []);
    } catch (err) {
      setEditoriasError(err);
    } finally {
      setEditoriasLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarEditorias();
  }, [carregarEditorias]);

  return (
    <BrowserRouter>
      <Layout
        editorias={editorias}
        editoriasLoading={editoriasLoading}
        editoriasError={editoriasError}
        onReloadEditorias={carregarEditorias}
      >
        {editoriasLoading && editorias.length === 0 && !editoriasError ? (
          <div className="container section">
            <LoadingState message="Carregando menu principal..." />
          </div>
        ) : null}
        {editoriasError && editorias.length === 0 ? (
          <div className="container section">
            <ErrorState error={editoriasError} onRetry={carregarEditorias} />
          </div>
        ) : null}
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<EditoriaPage />} path="/editorias/:slug" />
          <Route element={<ArticlePage />} path="/editorias/:editoriaSlug/artigos/:articleSlug" />
          <Route element={<AboutPage />} path="/quem-somos" />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
