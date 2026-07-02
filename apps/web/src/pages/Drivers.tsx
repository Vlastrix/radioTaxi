import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { DataTable } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';

type Driver = {
  id: number;
  name: string;
  phone: string;
  license: string;
  createdAt: string;
};

const emptyData: Driver[] = [];

export function Drivers() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    license: '',
  });

  const { data: drivers = emptyData, isLoading, error } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const { data } = await api.get('/drivers');
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (editingDriver) {
        return api.patch(`/drivers/${editingDriver.id}`, data);
      } else {
        return api.post('/drivers', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/drivers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });

  const openModal = (driver?: Driver) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        name: driver.name,
        phone: driver.phone,
        license: driver.license,
      });
    } else {
      setEditingDriver(null);
      setFormData({ name: '', phone: '', license: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDriver(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const columnHelper = createColumnHelper<Driver>();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Nombre',
      cell: info => <span className="font-semibold text-slate-800">{info.getValue()}</span>,
    }),
    columnHelper.accessor('phone', {
      header: 'Teléfono',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('license', {
      header: 'Licencia / Placa',
      cell: info => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-blue-600 px-2" onClick={() => openModal(row.original)} title="Editar">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 px-2 hover:text-red-700 hover:bg-red-50" onClick={() => {
            if (window.confirm('¿Seguro que deseas eliminar este chofer?')) {
              deleteMutation.mutate(row.original.id);
            }
          }} title="Eliminar">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: drivers,
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
          <h1 className="text-3xl font-bold text-slate-800">Choferes</h1>
          <p className="text-slate-500 mt-1">Gestiona el personal de choferes registrados en el sistema.</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Chofer
        </Button>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          Error al cargar choferes. Asegúrate de estar autenticado.
        </div>
      ) : (
        <DataTable table={table} isLoading={isLoading} />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingDriver ? 'Editar Chofer' : 'Nuevo Chofer'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 bg-slate-50 focus:bg-white transition-all outline-none"
                  placeholder="Ej. Carlos Martínez"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
                <input 
                  type="text" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 bg-slate-50 focus:bg-white transition-all outline-none"
                  placeholder="Ej. 77712345"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Licencia / Placa</label>
                <input 
                  type="text" 
                  required
                  value={formData.license}
                  onChange={(e) => setFormData({...formData, license: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 bg-slate-50 focus:bg-white transition-all outline-none"
                  placeholder="Ej. XYZ-1234"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
