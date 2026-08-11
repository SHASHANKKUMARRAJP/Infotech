import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import api from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { Table } from '../../components/ui/Table';
import toast from 'react-hot-toast';

export const ChallanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challan, setChallan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchChallan = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/challans/${id}`);
      setChallan(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load challan');
      navigate('/challans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallan();
  }, [id, navigate]);

  const handleConfirm = async () => {
    if (!window.confirm('Are you sure you want to confirm this challan? This will deduct stock permanently.')) return;
    setProcessing(true);
    try {
      await api.put(`/challans/${id}/confirm`);
      toast.success('Challan confirmed successfully. Stock deducted.');
      fetchChallan();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to confirm challan');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this challan?')) return;
    setProcessing(true);
    try {
      await api.put(`/challans/${id}/cancel`);
      toast.success('Challan cancelled successfully.');
      fetchChallan();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to cancel challan');
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !challan) return <LoadingState />;

  const itemColumns = [
    { header: 'Product', accessor: 'product_name_snapshot' },
    { header: 'SKU', accessor: 'sku_snapshot' },
    { header: 'Unit Price', accessor: (row: any) => `$${Number(row.unit_price).toFixed(2)}` },
    { header: 'Quantity', accessor: 'quantity' },
    { header: 'Subtotal', accessor: (row: any) => `$${Number(row.subtotal).toFixed(2)}` }
  ];

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigate('/challans')} className="p-2 text-zinc-400 hover:text-white bg-white/5 border-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white font-display">
            Challan {challan.challan_number}
          </h1>
          <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full border ${challan.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.15)]' : 
              challan.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]' : 
              'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {challan.status}
          </span>
        </div>
        <div className="flex space-x-3">
          {challan.status === 'DRAFT' && (
            <Button variant="primary" onClick={handleConfirm} disabled={processing}>
              <CheckCircle className="w-4 h-4 mr-2" /> Confirm & Dispatch
            </Button>
          )}
          {challan.status !== 'CANCELLED' && (
            <Button variant="danger" onClick={handleCancel} disabled={processing}>
              <XCircle className="w-4 h-4 mr-2" /> Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header border-b border-white/10">
          <h3 className="card-title font-display">Order Information</h3>
        </div>
        <div className="card-body grid grid-cols-2 md:grid-cols-4 gap-6 bg-black/20">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customer</p>
            <p className="mt-1 text-lg text-white font-medium">{challan.customer_name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Issue Date</p>
            <p className="mt-1 text-lg text-white">{new Date(challan.issue_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Quantity</p>
            <p className="mt-1 text-lg text-white">{challan.total_quantity} items</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Amount</p>
            <p className="mt-1 text-2xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">${Number(challan.total_amount).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header border-b-0">
          <h3 className="card-title font-display">Line Items</h3>
        </div>
        <Table 
          data={challan.items} 
          columns={itemColumns} 
          keyExtractor={(row: any) => row.id} 
        />
      </div>
    </div>
  );
};
