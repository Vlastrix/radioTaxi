import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { DataTable } from '../components/ui/Table';
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Historial de Viajes</h1>
          <p className="text-slate-500 mt-1">Registro de todas las solicitudes y servicios del sistema.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable table={table} isLoading={isLoading} />
      </div>
    </div>
  );
}
