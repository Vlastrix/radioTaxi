import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon, ExternalLink } from 'lucide-react';

export function ChoferPanel() {
  const queryClient = useQueryClient();
  const [showQR, setShowQR] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: currentTrip, isLoading } = useQuery({
    queryKey: ['choferTrip'],
    queryFn: async () => {
      const res = await api.get('/services/current');
      return res.data;
    },
    refetchInterval: 5000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      return api.patch(`/services/${currentTrip.id}/status`, { status });
    },
    onSuccess: (_, variables) => {
      if (variables === 'COMPLETED') {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          queryClient.invalidateQueries({ queryKey: ['choferTrip'] });
          setShowQR(false);
        }, 2500);
      } else {
        queryClient.invalidateQueries({ queryKey: ['choferTrip'] });
        setShowQR(false);
      }
    },
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500">Cargando...</div>;

  if (showSuccess) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[calc(100vh-100px)] animate-in zoom-in duration-300">
        <div className="w-32 h-32 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-slate-800">¡Viaje Completado!</h2>
        <p className="text-slate-500 mt-2 font-medium">Pago registrado con éxito</p>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="p-8 flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border-[8px] border-blue-100 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Esperando viaje</h2>
          <p className="text-slate-500 mt-2">La central te asignará un viaje pronto...</p>
        </div>
      </div>
    );
  }

  const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(currentTrip.origin)}&destination=${encodeURIComponent(currentTrip.destination)}`;

  return (
    <div className="p-6 max-w-md mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full relative animate-in slide-in-from-bottom-8">
        
        {/* Header Map */}
        <div className="h-48 relative z-0">
          <MapContainer 
            center={[-17.7833, -63.1821]} // Santa Cruz de la Sierra
            zoom={13} 
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
            style={{ width: '100%', height: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
          </MapContainer>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10"></div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col relative z-10 -mt-6 bg-white rounded-t-3xl shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-xl font-black text-slate-800 mb-1">Viaje #{currentTrip.id}</h1>
              {currentTrip.client && (
                <p className="text-slate-500 text-sm">Cliente: {currentTrip.client.name} • {currentTrip.client.phone}</p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentTrip.status === 'ASSIGNED' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
              {currentTrip.status === 'ASSIGNED' ? 'Por iniciar' : 'En curso'}
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex-1 mb-6 flex flex-col">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">O</div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-0.5">Recoger en</p>
                  <p className="text-sm font-bold text-slate-800">{currentTrip.origin}</p>
                </div>
              </div>
              <div className="w-full h-px bg-slate-200"></div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 font-bold">D</div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-0.5">Dejar en</p>
                  <p className="text-sm font-bold text-slate-800">{currentTrip.destination}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-6">
              <a 
                href={mapUrl}
                target="_blank" rel="noopener noreferrer"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <MapIcon className="w-4 h-4" />
                Ver ruta en Google Maps
                <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
              </a>
            </div>
          </div>

          {/* Acciones */}
          {currentTrip.status === 'ASSIGNED' ? (
            <button
              onClick={() => updateStatusMutation.mutate('IN_PROGRESS')}
              disabled={updateStatusMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50"
            >
              Iniciar Viaje
            </button>
          ) : (
            <div className="space-y-3">
              {!showQR ? (
                <>
                  <button
                    onClick={() => updateStatusMutation.mutate('COMPLETED')}
                    disabled={updateStatusMutation.isPending}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    Cobrar en Efectivo
                  </button>
                  <button
                    onClick={() => setShowQR(true)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg py-4 rounded-2xl transition-all active:scale-95"
                  >
                    Mostrar QR de Cobro
                  </button>
                </>
              ) : (
                <div className="bg-white p-6 border-2 border-slate-200 rounded-3xl text-center shadow-xl animate-in zoom-in-95">
                  <h3 className="font-bold text-slate-800 mb-4">Escanea para Pagar</h3>
                  <div className="w-48 h-48 bg-slate-100 mx-auto rounded-xl flex items-center justify-center mb-6">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PagoRadioTaxi" alt="QR Code" className="opacity-80" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowQR(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Cancelar</button>
                    <button 
                      onClick={() => updateStatusMutation.mutate('COMPLETED')}
                      className="flex-1 py-3 bg-emerald-500 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/30"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
