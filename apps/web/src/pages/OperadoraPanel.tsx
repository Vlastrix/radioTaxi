import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';

export function OperadoraPanel() {
  const queryClient = useQueryClient();
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['operadoraDashboard'],
    queryFn: async () => {
      const res = await api.get('/services/operadora');
      return res.data;
    },
    refetchInterval: 3000, // Poll every 3 seconds
  });

  const assignDriverMutation = useMutation({
    mutationFn: async ({ serviceId, driverId }: { serviceId: number, driverId: number }) => {
      return api.patch(`/services/${serviceId}/assign`, { driverId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operadoraDashboard'] });
      setSelectedTripId(null);
    },
  });

  if (isLoading) return <div className="p-8 text-slate-500">Cargando tablero...</div>;

  const pendingTrips = data?.pendingTrips || [];
  const availableDrivers = data?.availableDrivers || [];

  return (
    <div className="p-8 max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Central de Operaciones</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Columna Izquierda: Viajes Pendientes */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-bold text-slate-700 flex items-center justify-between">
              Viajes Pendientes
              <span className="bg-orange-100 text-orange-700 py-1 px-3 rounded-full text-xs">{pendingTrips.length}</span>
            </h2>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50/50 flex flex-col">
            {pendingTrips.length === 0 ? (
              <div className="h-full flex-1 flex items-center justify-center text-slate-400 text-sm text-center px-6">
                No hay viajes pendientes
              </div>
            ) : (
              pendingTrips.map((trip: any) => (
                <div 
                  key={trip.id} 
                  onClick={() => setSelectedTripId(trip.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedTripId === trip.id ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'}`}
                >
                  <p className="text-xs text-slate-400 mb-1">Viaje #{trip.id} - {new Date(trip.createdAt).toLocaleTimeString()}</p>
                  <div className="mb-2">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1"><span className="text-blue-500 mr-1">O:</span> {trip.origin}</p>
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1"><span className="text-violet-500 mr-1">D:</span> {trip.destination}</p>
                  </div>
                  {trip.client && <p className="text-xs text-slate-500">Cliente: {trip.client.name} - {trip.client.phone}</p>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columna Derecha: Choferes Disponibles */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-bold text-slate-700 flex items-center justify-between">
              Choferes Libres
              <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs">{availableDrivers.length}</span>
            </h2>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50/50 flex flex-col">
            {!selectedTripId ? (
              <div className="h-full flex-1 flex items-center justify-center text-slate-400 text-sm text-center px-6">
                Selecciona un viaje de la lista izquierda para asignar a un chofer
              </div>
            ) : availableDrivers.length === 0 ? (
              <div className="h-full flex-1 flex items-center justify-center text-slate-400 text-sm text-center px-6">
                No hay choferes disponibles
              </div>
            ) : (
              availableDrivers.map((driver: any) => (
                <div key={driver.id} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{driver.name}</p>
                    <p className="text-xs text-slate-500">Tel: {driver.phone}</p>
                  </div>
                  <button
                    onClick={() => assignDriverMutation.mutate({ serviceId: selectedTripId, driverId: driver.id })}
                    disabled={assignDriverMutation.isPending}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-sm transition-all disabled:opacity-50"
                  >
                    Asignar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
