import React, { useEffect, useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import api from '../../lib/api';
import { Table } from '../../components/ui/Table';
import { LoadingState } from '../../components/ui/LoadingState';
import { Button } from '../../components/ui/Button';

export const InventoryMovements: React.FC = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/inventory/movements');
      setMovements(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const columns = [
    { 
      header: 'Date', 
      accessor: (row: any) => <span className="text-zinc-400">{new Date(row.created_at).toLocaleString()}</span> 
    },
    { header: 'Product', accessor: 'product_name' },
    { header: 'SKU', accessor: (row: any) => <span className="font-mono text-zinc-400 text-xs">{row.sku}</span> },
    { 
      header: 'Type', 
      accessor: (row: any) => (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border 
          ${row.movement_type === 'IN' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
          {row.movement_type}
        </span>
      )
    },
    { 
      header: 'Quantity', 
      accessor: (row: any) => (
        <span className={`font-bold ${row.movement_type === 'IN' ? 'text-emerald-400' : 'text-rose-400'}`}>
          {row.movement_type === 'IN' ? '+' : '-'}{row.quantity}
        </span>
      ) 
    },
    { header: 'Remarks', accessor: 'remarks' },
    { header: 'User', accessor: (row: any) => <span className="text-zinc-400">{row.first_name || ''} {row.last_name || ''}</span> }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Banner Section */}
      <div className="relative rounded-3xl overflow-hidden h-48 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=2000&q=80" 
          alt="Inventory Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-display tracking-tight">Inventory Movements</h1>
              <p className="mt-2 text-zinc-400 max-w-xl">Audit trail of all inbound and outbound stock transactions.</p>
            </div>
            <div className="hidden sm:block">
              <Button size="lg" onClick={() => window.alert('Use the Stock Movement action to move stock')} className="shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <ArrowRightLeft className="w-5 h-5 mr-2" /> Move Stock
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <div className="space-y-4">
          <Table 
            data={movements} 
            columns={columns} 
            keyExtractor={(row: any) => row.id} 
            emptyMessage="No stock movements recorded yet."
          />
        </div>
      )}
    </div>
  );
};
