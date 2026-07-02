import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Headset, Car, FileText, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/auth';

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Dinámicamente definimos qué links ver según el rol
  const getNavItems = () => {
    if (!user) return [];
    
    if (user.role === 'ADMIN') {
      return [
        { name: 'Dashboard', path: '/admin', icon: Home },
        { name: 'Viajes en Vivo', path: '/operadora', icon: MapPin },
        { name: 'Choferes', path: '/choferes', icon: Car },
        { name: 'Operadoras', path: '/operadoras', icon: Headset },
        { name: 'Clientes', path: '/clientes', icon: Users },
        { name: 'Historial', path: '/historial', icon: FileText },
      ];
    }
    
    if (user.role === 'OPERATOR') {
      return [
        { name: 'Operadora', path: '/operadora', icon: Headset },
        { name: 'Historial', path: '/historial', icon: FileText },
      ];
    }

    if (user.role === 'DRIVER') {
      return [
        { name: 'Viaje Actual', path: '/chofer', icon: Car },
      ];
    }

    if (user.role === 'CLIENT') {
      return [
        { name: 'Pedir Taxi', path: '/cliente', icon: MapPin },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 h-full bg-white shadow-xl w-64 z-30 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 flex flex-col border-r border-slate-100
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-center gap-3">
          <img src="/logo.png" alt="RadioTaxi Logo" className="w-12 h-12 object-contain rounded-xl shadow-sm" />
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900">
            Radio Taxi
          </h2>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
