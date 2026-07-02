import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { DataTable } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';

type Client = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  location: string | null;
  createdAt: string;
};

const columnHelper = createColumnHelper<Client>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Nombre',
    cell: info => <span className="font-semibold text-slate-800">{info.getValue()}</span>,
  }),
  columnHelper.accessor('phone', {
    header: 'Teléfono',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => info.getValue() || <span className="text-slate-400 italic">No provisto</span>,
  }),
  columnHelper.accessor('location', {
    header: 'Ubicación frecuente',
    cell: info => info.getValue() || <span className="text-slate-300">-</span>,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Acciones',
    cell: () => (
      <Button variant="ghost" size="sm" className="text-blue-600">
        Ver / Editar
      </Button>
    ),
  }),
];

const emptyData: Client[] = [];

export function Clients() {
  const { data: clients = emptyData, isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data } = await api.get('/clients');
      return data;
    },
  });

  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-top-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Clientes</h1>
          <p className="text-slate-500 mt-1">Gestiona el directorio de pasajeros habituales.</p>
        </div>
        <Button>
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          Error al cargar clientes. Asegúrate de estar autenticado.
        </div>
      ) : (
        <DataTable table={table} isLoading={isLoading} />
      )}
    </div>
  );
}
