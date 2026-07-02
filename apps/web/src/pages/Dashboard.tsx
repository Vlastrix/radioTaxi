import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { Users, Car, CheckCircle } from 'lucide-react';

export function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      // Usaremos el mismo endpoint de operadora solo para rellenar datos rápidos,
      // en un caso real se usaría un endpoint de estadísticas.
      const res = await api.get('/services/operadora');
      return res.data;
    },
  });

  if (isLoading) return <div className="p-8 text-slate-500">Cargando...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in zoom-in-95">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Car className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-500 font-medium">Choferes Libres</p>
            <h2 className="text-3xl font-black text-slate-800">{data?.availableDrivers?.length || 0}</h2>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-500 font-medium">Viajes Pendientes</p>
            <h2 className="text-3xl font-black text-slate-800">{data?.pendingTrips?.length || 0}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-500 font-medium">Sistema</p>
            <h2 className="text-xl font-black text-slate-800">Activo</h2>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Gestión Rápida</h2>
        <p className="text-slate-500">
          Desde aquí puedes monitorear el sistema. Para crear choferes, vehículos y sucursales, 
          utiliza las opciones del menú lateral (cuando estén implementadas en las próximas versiones).
        </p>
      </div>
    </div>
  );
}
