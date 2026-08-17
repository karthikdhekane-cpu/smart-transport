import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyState?: ReactNode;
  loading?: boolean;
  loadingState?: ReactNode;
}

export default function Table<T>({ columns, data, emptyState, loading, loadingState }: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        {loadingState || (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            Loading...
          </div>
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        {emptyState || (
          <div className="text-center">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm text-slate-500">No data available</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${
                  column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                }`}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-3 text-sm ${
                    column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
