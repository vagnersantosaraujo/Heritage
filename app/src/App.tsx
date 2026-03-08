import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import DashboardPessoal from './pages/DashboardPessoal';
import DashboardFamilia from './pages/DashboardFamilia';
import Transacoes from './pages/Transacoes';
import NovaTransacao from './pages/NovaTransacao';
import Goals from './pages/Goals';
import NovaMeta from './pages/NovaMeta';
import AI from './pages/AI';
import Perfil from './pages/Perfil';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/painel-pessoal" element={<ProtectedRoute><DashboardPessoal /></ProtectedRoute>} />
          <Route path="/painel-familia" element={<ProtectedRoute><DashboardFamilia /></ProtectedRoute>} />
          <Route path="/transacoes" element={<ProtectedRoute><Transacoes /></ProtectedRoute>} />
          <Route path="/nova-transacao" element={<ProtectedRoute><NovaTransacao /></ProtectedRoute>} />
          <Route path="/metas" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/nova-meta" element={<ProtectedRoute><NovaMeta /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><AI /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/painel-pessoal" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
