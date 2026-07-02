import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { useAuth } from './lib/auth';

import { OperadoraPanel } from './pages/OperadoraPanel';
import { ChoferPanel } from './pages/ChoferPanel';
import { ClientePanel } from './pages/ClientePanel';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { History } from './pages/History';
import { Drivers } from './pages/Drivers';
import { Operators } from './pages/Operators';

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'CLIENT': return <Navigate to="/cliente" replace />;
    case 'OPERATOR': return <Navigate to="/operadora" replace />;
    case 'DRIVER': return <Navigate to="/chofer" replace />;
    case 'ADMIN': return <Navigate to="/admin" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<RootRedirect />} />
      
      {/* Protected Routes inside MainLayout */}
      <Route element={<MainLayout />}>
        {/* Rutas Admin */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/choferes" element={<Drivers />} />
          <Route path="/operadoras" element={<Operators />} />
        </Route>

        {/* Rutas Compartidas Admin / Operadora */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'OPERATOR']} />}>
          <Route path="/operadora" element={<OperadoraPanel />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/historial" element={<History />} />
        </Route>

        {/* Rutas Chofer */}
        <Route element={<ProtectedRoute allowedRoles={['DRIVER']} />}>
          <Route path="/chofer" element={<ChoferPanel />} />
        </Route>

        {/* Rutas Cliente */}
        <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
          <Route path="/cliente" element={<ClientePanel />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
