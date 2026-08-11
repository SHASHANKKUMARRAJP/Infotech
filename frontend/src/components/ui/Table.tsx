import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
}

export function Table<T>({ columns, data, keyExtractor, emptyMessage = 'No data available' }: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="p-16 text-center text-zinc-500 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full transition-all duration-500 animate-fade-in">
      
      {/* Header Row */}
      <div className="hidden sm:flex items-center px-8 py-4 mb-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5">
        {columns.map((col, index) => (
          <div
            key={index}
            className="flex-1 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest"
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Data Rows */}
      <div className="space-y-4">
        {data.map((row, rowIndex) => (
          <div 
            key={keyExtractor(row)} 
            className="group relative flex flex-col sm:flex-row sm:items-center px-8 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] hover:border-brand-500/30 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 cursor-default"
            style={{ animationDelay: `${rowIndex * 50}ms` }}
          >
            {/* Ambient hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
            
            {columns.map((col, index) => (
              <div key={index} className="flex-1 flex flex-col sm:block mb-3 sm:mb-0 relative z-10">
                <span className="sm:hidden text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{col.header}</span>
                <div className="text-sm text-zinc-300 group-hover:text-white transition-colors duration-300">
                  {typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : String(row[col.accessor] as unknown)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
