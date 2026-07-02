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

type Operator = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

const emptyData: Operator[] = [];

export function Operators() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { data: operators = emptyData, isLoading, error } = useQuery({
    queryKey: ['operators'],
    queryFn: async () => {
      const { data } = await api.get('/users/operators');
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload: any = { ...data };
      if (editingOperator && !payload.password) {
        delete payload.password;
      }
      if (editingOperator) {
        return api.patch(`/users/operators/${editingOperator.id}`, payload);
      } else {
        return api.post('/users/operators', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      closeModal();
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error al guardar la operadora');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/users/operators/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
    },
  });

  const openModal = (operator?: Operator) => {
    if (operator) {
      setEditingOperator(operator);
      setFormData({
        name: operator.name,
        email: operator.email,
        password: '',
      });
    } else {
      setEditingOperator(null);
      setFormData({ name: '', email: '', password: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOperator(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const columnHelper = createColumnHelper<Operator>();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Nombre',
      cell: info => <span className="font-semibold text-slate-800">{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
      header: 'Email / Usuario',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Fecha Creación',
      cell: info => new Date(info.getValue()).toLocaleDateString(),
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
            if (window.confirm('¿Seguro que deseas eliminar esta operadora? (No podrá acceder al sistema)')) {
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
    data: operators,
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
          <h1 className="text-3xl font-bold text-slate-800">Operadoras</h1>
          <p className="text-slate-500 mt-1">Gestiona los usuarios con acceso a la Central de Operaciones.</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-5 h-5 mr-2" />
          Nueva Operadora
        </Button>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          Error al cargar operadoras. Asegúrate de estar autenticado.
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
                {editingOperator ? 'Editar Operadora' : 'Nueva Operadora'}
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
                  placeholder="Ej. María Gonzales"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 bg-slate-50 focus:bg-white transition-all outline-none"
                  placeholder="Ej. maria@radiotaxi.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
                <input 
                  type="password" 
                  required={!editingOperator}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 bg-slate-50 focus:bg-white transition-all outline-none"
                  placeholder={editingOperator ? "Dejar en blanco para no cambiar" : "Mínimo 6 caracteres"}
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
