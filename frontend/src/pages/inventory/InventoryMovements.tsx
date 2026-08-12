import React, { useEffect, useState } from 'react';
import { ArrowRightLeft, X, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import api from '../../lib/api';
import { Table } from '../../components/ui/Table';
import { LoadingState } from '../../components/ui/LoadingState';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import toast from 'react-hot-toast';

export const InventoryMovements: React.FC = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    product_id: '',
    movement_type: 'IN',
    quantity: 1,
    reason: '',
  });

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

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=1000');
      setProducts(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMovements();
    fetchProducts();
  }, []);

  const handleOpenModal = () => {
    setFormData({ product_id: '', movement_type: 'IN', quantity: 1, reason: '' });
    setShowModal(true);
  };

  const handleSubmitMovement = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.product_id) {
      toast.error('Please select a product');
      return;
    }
    if (formData.quantity <= 0) {
      toast.error('Quantity must be greater than zero');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/inventory/move', formData);
      toast.success(`Stock ${formData.movement_type === 'IN' ? 'added' : 'removed'} successfully`);
      setShowModal(false);
      fetchMovements();
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to record stock movement');
    } finally {
      setSubmitting(false);
    }
  };

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
              <Button size="lg" onClick={handleOpenModal} className="shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <ArrowRightLeft className="w-5 h-5 mr-2" /> Move Stock
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Move Stock button */}
      <div className="sm:hidden">
        <Button className="w-full" onClick={handleOpenModal}>
          <ArrowRightLeft className="w-4 h-4 mr-2" /> Move Stock
        </Button>
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

      {/* Stock Movement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-lg mx-4 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="text-xl font-bold text-white font-display">Record Stock Movement</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmitMovement} className="p-6 space-y-5">
              {/* Movement Type Toggle */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Movement Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, movement_type: 'IN' })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                      formData.movement_type === 'IN'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    <ArrowDownToLine className="w-4 h-4" /> Stock IN
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, movement_type: 'OUT' })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                      formData.movement_type === 'OUT'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    <ArrowUpFromLine className="w-4 h-4" /> Stock OUT
                  </button>
                </div>
              </div>

              {/* Product Select */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Product <span className="text-brand-500">*</span></label>
                <Select
                  value={formData.product_id}
                  onChange={(val) => setFormData({ ...formData, product_id: val })}
                  placeholder="-- Select a product --"
                  options={products.map((p: any) => ({
                    value: p.id,
                    label: `${p.sku} — ${p.product_name} (Stock: ${p.current_stock})`
                  }))}
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Quantity <span className="text-brand-500">*</span></label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 0 })}
                  required
                  className="block w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all duration-300 shadow-sm sm:text-sm"
                  placeholder="Enter quantity"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Remarks / Reason</label>
                <textarea
                  rows={2}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="block w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all duration-300 shadow-sm sm:text-sm"
                  placeholder="e.g., Purchase Order #1234, Damaged goods return"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Recording...' : `Record ${formData.movement_type === 'IN' ? 'Inbound' : 'Outbound'}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
