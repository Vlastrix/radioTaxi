import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si el usuario es ADMIN, le permitimos ver cualquier panel
    if (user.role === 'ADMIN') {
      return <Outlet />;
    }

    // Si no tiene el rol permitido, redirigir al panel correcto según su rol
    switch (user.role) {
      case 'CLIENT': return <Navigate to="/cliente" replace />;
      case 'OPERATOR': return <Navigate to="/operadora" replace />;
      case 'DRIVER': return <Navigate to="/chofer" replace />;
      case 'ADMIN': return <Navigate to="/admin" replace />;
      default: return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};
