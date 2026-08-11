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
      <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Header Row */}
        <div className="hidden sm:flex items-center px-6 py-4 bg-black/40 border-b border-white/10 shadow-inner">
          {columns.map((col, index) => (
            <div
              key={index}
              className="flex-1 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest"
            >
              {col.header}
            </div>
          ))}
        </div>

        {/* Data Rows */}
        <div className="divide-y divide-white/5">
          {data.map((row, rowIndex) => (
            <div 
              key={keyExtractor(row)} 
              className="group relative flex flex-col sm:flex-row sm:items-center px-6 py-3.5 hover:bg-white/[0.03] transition-colors duration-200"
            >
              {/* Subtle hover highlight */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {columns.map((col, index) => (
                <div key={index} className="flex-1 flex flex-col sm:block mb-2 sm:mb-0 relative z-10 px-2 sm:px-0">
                  <span className="sm:hidden text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-0.5">{col.header}</span>
                  <div className="text-sm text-zinc-300 group-hover:text-white transition-colors duration-200">
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
    </div>
  );
}
