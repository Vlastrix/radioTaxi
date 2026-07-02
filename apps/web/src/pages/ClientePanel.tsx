import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';

export function ClientePanel() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const queryClient = useQueryClient();

  // Polling every 5 seconds
  const { data: currentTrip, isLoading } = useQuery({
    queryKey: ['currentTrip'],
    queryFn: async () => {
      const { data } = await api.get('/services/current');
      return data;
    },
    refetchInterval: 5000,
  });

  const requestTripMutation = useMutation({
    mutationFn: async () => {
      return api.post('/services', { origin, destination });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentTrip'] });
      setOrigin('');
      setDestination('');
    },
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500">Cargando...</div>;

  if (currentTrip) {
    const statusText: Record<string, string> = {
      PENDING: 'Buscando chofer...',
      ASSIGNED: 'Chofer en camino',
      IN_PROGRESS: 'Viaje en curso',
    };

    return (
      <div className="p-8 max-w-lg mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in zoom-in-95">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Estado de tu Viaje</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              {statusText[currentTrip.status] || currentTrip.status}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mt-1"></div>
                <div className="w-0.5 h-10 bg-slate-200 my-1"></div>
                <div className="w-3 h-3 rounded-full bg-violet-500 mb-1"></div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Origen</p>
                <p className="text-slate-500 text-sm mb-3">{currentTrip.origin}</p>
                <p className="text-sm font-semibold text-slate-800">Destino</p>
                <p className="text-slate-500 text-sm">{currentTrip.destination}</p>
              </div>
            </div>
            
            {currentTrip.driver && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mt-4">
                <p className="text-sm font-semibold text-slate-800">Datos del Chofer</p>
                <p className="text-slate-600 text-sm">Nombre: {currentTrip.driver.name}</p>
                <p className="text-slate-600 text-sm">Teléfono: {currentTrip.driver.phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Pedir Taxi</h1>
        <p className="text-slate-500 mb-6 text-sm">Ingresa tu ubicación y destino para solicitar un viaje.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); requestTripMutation.mutate(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Dirección de Origen</label>
            <input 
              type="text" 
              required
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 bg-slate-50 focus:bg-white transition-all outline-none"
              placeholder="Ej. Calle 123 esquina Libertad"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Dirección de Destino</label>
            <input 
              type="text" 
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 bg-slate-50 focus:bg-white transition-all outline-none"
              placeholder="Ej. Centro Comercial"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={requestTripMutation.isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            {requestTripMutation.isPending ? 'Solicitando...' : 'Pedir Ahora'}
          </button>
        </form>
      </div>
    </div>
  );
}
