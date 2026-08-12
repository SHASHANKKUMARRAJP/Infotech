import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import api from '../../lib/api';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';

export const ChallanList: React.FC = () => {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallans = async () => {
      try {
        const res = await api.get('/challans');
        setChallans(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchChallans();
  }, []);

  const columns = [
    { header: 'Challan Number', accessor: (row: any) => <span className="font-mono text-brand-400">{row.challan_number}</span> },
    { 
      header: 'Issue Date', 
      accessor: (row: any) => <span className="text-zinc-400">{new Date(row.issue_date).toLocaleDateString()}</span> 
    },
    { header: 'Customer', accessor: 'customer_name' },
    { header: 'Total Items', accessor: 'total_quantity' },
    { header: 'Total Amount', accessor: (row: any) => <span className="text-emerald-400 font-medium">${Number(row.total_amount).toFixed(2)}</span> },
    { 
      header: 'Status', 
      accessor: (row: any) => {
        let color = 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        if (row.status === 'CONFIRMED') color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.15)]';
        if (row.status === 'DRAFT') color = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        if (row.status === 'CANCELLED') color = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        return (
          <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${color}`}>
            {row.status}
          </span>
        );
      }
    },
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <div className="flex space-x-3">
          <Link to={`/challans/${row.id}`} className="text-brand-400 hover:text-brand-300 font-medium transition-colors hover:underline">View</Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Banner Section */}
      <div className="relative rounded-3xl overflow-hidden h-48 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80" 
          alt="Challans Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-display tracking-tight">Sales Challans</h1>
              <p className="mt-2 text-zinc-400 max-w-xl">Manage order dispatches, invoicing, and release of stock.</p>
            </div>
            <Link to="/challans/new" className="hidden sm:block">
              <Button size="lg" className="shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <Plus className="w-5 h-5 mr-2" /> New Challan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <Table 
          data={challans} 
          columns={columns} 
          keyExtractor={(row: any) => row.id} 
          emptyMessage="No challans found."
        />
      )}
    </div>
  );
};
