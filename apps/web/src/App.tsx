import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/Login';
import { Clients } from './pages/Clients';

// Simple placeholder components for now
const Dashboard = () => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h1 className="text-2xl font-bold text-slate-800 mb-2">Dashboard</h1>
    <p className="text-slate-500">Resumen general de servicios, pagos y taxis disponibles.</p>
  </div>
);

const Operadora = () => <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in"><h1 className="text-2xl font-bold text-slate-800">Operadora</h1></div>;
const Choferes = () => <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in"><h1 className="text-2xl font-bold text-slate-800">Choferes</h1></div>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes inside MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<Clients />} />
        <Route path="operadora" element={<Operadora />} />
        <Route path="choferes" element={<Choferes />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
