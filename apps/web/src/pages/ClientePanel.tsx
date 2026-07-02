import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { Navigation, Map as MapIcon, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';



const originIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div style="width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24]
});

const destIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div style="width: 24px; height: 24px; background-color: #8b5cf6; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24]
});

// Helper para Geocodificación Inversa
const getAddressFromCoords = async (lat: number, lon: number) => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await res.json();
    return data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  } catch (error) {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
};

function LocationPicker({ 
  mapMode, 
  setOrigin, setDestination, 
  setOriginCoords, setDestCoords 
}: { 
  mapMode: 'ORIGIN' | 'DESTINATION',
  setOrigin: (d: string) => void,
  setDestination: (d: string) => void,
  setOriginCoords: (c: [number, number]) => void,
  setDestCoords: (c: [number, number]) => void 
}) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      if (mapMode === 'ORIGIN') {
        setOriginCoords([lat, lng]);
        setOrigin('Cargando dirección...');
        const address = await getAddressFromCoords(lat, lng);
        setOrigin(address);
      } else {
        setDestCoords([lat, lng]);
        setDestination('Cargando dirección...');
        const address = await getAddressFromCoords(lat, lng);
        setDestination(address);
      }
    }
  });
  return null;
}

export function ClientePanel() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [mapMode, setMapMode] = useState<'ORIGIN' | 'DESTINATION'>('DESTINATION');
  
  const queryClient = useQueryClient();

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
      setOriginCoords(null);
      setDestCoords(null);
    },
  });

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setOrigin('Obteniendo ubicación...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setOriginCoords([latitude, longitude]);
        const address = await getAddressFromCoords(latitude, longitude);
        setOrigin(address);
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        setOrigin('');
        alert('No pudimos acceder a tu ubicación. Por favor, revisa tus permisos.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

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
    <div className="p-8 max-w-xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Pedir Taxi</h1>
        <p className="text-slate-500 mb-6 text-sm">Ingresa tu ubicación y destino para solicitar un viaje.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); requestTripMutation.mutate(); }} className="space-y-6">
          
          {/* Origen */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-semibold text-slate-700">Dirección de Origen</label>
              <button 
                type="button" 
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="text-xs flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-pulse' : ''}`} />
                {isLocating ? 'Ubicando...' : 'Mi ubicación'}
              </button>
            </div>
            <div className="relative group" onClick={() => setMapMode('ORIGIN')}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              </div>
              <input 
                type="text" 
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                onFocus={() => setMapMode('ORIGIN')}
                className={`w-full p-3 pl-9 rounded-xl border transition-all outline-none text-sm bg-slate-50 focus:bg-white
                  ${mapMode === 'ORIGIN' ? 'border-blue-400 ring-2 ring-blue-500/20' : 'border-slate-200'}
                `}
                placeholder="Escribe de dónde partimos..."
              />
              <div className={`absolute right-3 top-3 text-[10px] font-bold px-2 py-1 rounded transition-colors
                ${mapMode === 'ORIGIN' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 cursor-pointer'}
              `}>
                <Crosshair className="w-3 h-3 inline-block mr-1" /> Mapa
              </div>
            </div>
          </div>

          {/* Destino */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Dirección de Destino</label>
            <div className="relative group mb-4" onClick={() => setMapMode('DESTINATION')}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div>
              </div>
              <input 
                type="text" 
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setMapMode('DESTINATION')}
                className={`w-full p-3 pl-9 rounded-xl border transition-all outline-none text-sm bg-slate-50 focus:bg-white
                  ${mapMode === 'DESTINATION' ? 'border-violet-400 ring-2 ring-violet-500/20' : 'border-slate-200'}
                `}
                placeholder="Escribe el destino o toca en el mapa..."
              />
              <div className={`absolute right-3 top-3 text-[10px] font-bold px-2 py-1 rounded transition-colors
                ${mapMode === 'DESTINATION' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 cursor-pointer'}
              `}>
                <Crosshair className="w-3 h-3 inline-block mr-1" /> Mapa
              </div>
            </div>

            {/* Mapa Interactivo Compartido */}
            <div className={`rounded-xl border overflow-hidden relative z-0 transition-colors ${mapMode === 'ORIGIN' ? 'border-blue-300' : 'border-violet-300'}`} style={{ height: '240px' }}>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-2 pointer-events-none">
                <MapIcon className="w-3.5 h-3.5" /> 
                {mapMode === 'ORIGIN' ? 'Toca para elegir Origen (Azul)' : 'Toca para elegir Destino (Violeta)'}
              </div>
              <MapContainer center={[-17.7833, -63.1821]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {originCoords && (
                  <Marker position={originCoords} icon={originIcon}>
                    <Popup>Origen</Popup>
                  </Marker>
                )}
                {destCoords && (
                  <Marker position={destCoords} icon={destIcon}>
                    <Popup>Destino</Popup>
                  </Marker>
                )}
                <LocationPicker 
                  mapMode={mapMode}
                  setOrigin={setOrigin}
                  setDestination={setDestination} 
                  setOriginCoords={setOriginCoords}
                  setDestCoords={setDestCoords}
                />
              </MapContainer>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={requestTripMutation.isPending || !origin || !destination}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 text-lg"
          >
            {requestTripMutation.isPending ? 'Solicitando Viaje...' : 'Pedir Taxi Ahora'}
          </button>
        </form>
      </div>
    </div>
  );
}
