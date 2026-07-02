import { flexRender } from '@tanstack/react-table';
import type { Table as ReactTable } from '@tanstack/react-table';

interface DataTableProps<TData> {
  table: ReactTable<TData>;
  isLoading?: boolean;
}

export function DataTable<TData>({ table, isLoading }: DataTableProps<TData>) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-in fade-in">
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase text-xs tracking-wider">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" />
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce [animation-delay:-.3s]" />
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce [animation-delay:-.5s]" />
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={table.getAllColumns().length} className="h-24 text-center text-slate-500 italic">
                  No hay registros para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view (Cards) */}
      <div className="md:hidden flex flex-col gap-4 p-4 bg-slate-50/50">
        {isLoading ? (
          <div className="h-32 flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" />
            <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce [animation-delay:-.3s]" />
            <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce [animation-delay:-.5s]" />
          </div>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div key={row.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mb-2">
              {row.getVisibleCells().map((cell, index) => {
                const headerName = typeof cell.column.columnDef.header === 'string' 
                  ? cell.column.columnDef.header 
                  : cell.column.id;
                const isActions = headerName.toLowerCase() === 'acciones' || cell.column.id === 'actions';

                if (index === 0) {
                  return (
                    <div key={cell.id} className="bg-slate-50 p-4 border-b border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {headerName}
                      </span>
                      <div className="text-base text-slate-800 break-words">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </div>
                  );
                }

                if (isActions) {
                  return (
                    <div key={cell.id} className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-end items-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  );
                }

                return (
                  <div key={cell.id} className="px-4 py-3 flex justify-between items-center gap-4 border-b border-slate-50 last:border-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
                      {headerName}
                    </span>
                    <div className="text-sm text-slate-700 font-medium break-words text-right">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500 italic border border-slate-200 rounded-2xl bg-white shadow-sm">
            No hay registros para mostrar.
          </div>
        )}
      </div>
      
      {/* Pagination controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
        <div className="text-sm text-slate-500 font-medium">
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount() || 1}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
          >
            Anterior
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
