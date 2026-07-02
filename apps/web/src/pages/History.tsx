import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { DataTable } from '../components/ui/Table';
import { Download } from 'lucide-react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';

type Trip = {
  id: number;
  origin: string;
  destination: string;
  status: string;
  createdAt: string;
  client?: { name: string };
  driver?: { name: string };
};

export function History() {
  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['tripsHistory'],
    queryFn: async () => {
      const res = await api.get('/services/history');
      return res.data;
    },
  });

  const exportToCSV = () => {
    if (!trips || trips.length === 0) return;
    
    const headers = ['ID', 'Fecha', 'Cliente', 'Chofer', 'Origen', 'Destino', 'Estado'];
    
    const rows = trips.map((trip: Trip) => {
      const statusMap: Record<string, string> = {
        COMPLETED: 'Completado',
        CANCELLED: 'Cancelado',
        IN_PROGRESS: 'En Curso',
        ASSIGNED: 'Asignado',
        PENDING: 'Pendiente'
      };

      return [
        trip.id,
        `"${new Date(trip.createdAt).toLocaleString()}"`,
        `"${trip.client?.name || 'N/A'}"`,
        `"${trip.driver?.name || 'Sin Asignar'}"`,
        `"${trip.origin}"`,
        `"${trip.destination}"`,
        `"${statusMap[trip.status] || trip.status}"`
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map((row: (string | number)[]) => row.join(','))
    ].join('\n');
    
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Historial_Viajes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columnHelper = createColumnHelper<Trip>();
  const columns = [
    columnHelper.accessor('id', { header: 'ID' }),
    columnHelper.accessor('createdAt', {
      header: 'Fecha',
      cell: info => new Date(info.getValue()).toLocaleString(),
    }),
    columnHelper.accessor(row => row.client?.name || 'N/A', {
      id: 'client',
      header: 'Cliente',
    }),
    columnHelper.accessor(row => row.driver?.name || 'Sin Asignar', {
      id: 'driver',
      header: 'Chofer',
    }),
    columnHelper.accessor('origin', { header: 'Origen' }),
    columnHelper.accessor('destination', { header: 'Destino' }),
    columnHelper.accessor('status', {
      header: 'Estado',
      cell: info => {
        const val = info.getValue();
        if (val === 'COMPLETED') return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Completado</span>;
        if (val === 'CANCELLED') return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Cancelado</span>;
        if (val === 'IN_PROGRESS') return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">En Curso</span>;
        if (val === 'ASSIGNED') return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Asignado</span>;
        return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">Pendiente</span>;
      }
    }),
  ];

  const table = useReactTable({
    data: trips,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in zoom-in-95">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Historial de Viajes</h1>
          <p className="text-slate-500 mt-1">Registro de todas las solicitudes y servicios del sistema.</p>
        </div>
        <button 
          onClick={exportToCSV}
          disabled={!trips.length}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-sm active:translate-y-0.5 hover:shadow-md"
        >
          <Download className="w-5 h-5" />
          Exportar a Excel
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable table={table} isLoading={isLoading} />
      </div>
    </div>
  );
}
