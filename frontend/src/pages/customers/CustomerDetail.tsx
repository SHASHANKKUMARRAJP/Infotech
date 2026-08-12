import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Plus, User, Mail, Phone, MapPin, Building2, FileText } from 'lucide-react';
import api from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { Table } from '../../components/ui/Table';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customer, setCustomer] = useState<any>(null);
  const [followups, setFollowups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Follow-up form
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [followupData, setFollowupData] = useState({ notes: '', followup_date: '' });
  const [savingFollowup, setSavingFollowup] = useState(false);

  const fetchCustomer = async () => {
    try {
      const res = await api.get(`/customers/${id}`);
      setCustomer(res.data);
    } catch (error) {
      toast.error('Failed to load customer');
      navigate('/customers');
    }
  };

  const fetchFollowups = async () => {
    try {
      const res = await api.get(`/customers/${id}/followups`);
      setFollowups(res.data);
    } catch (error) {
      console.error('Failed to load followups', error);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchCustomer(), fetchFollowups()]);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/customers/${id}`);
      toast.success('Customer deleted successfully');
      navigate('/customers');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete customer');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupData.notes || !followupData.followup_date) {
      toast.error('Please fill in all followup fields');
      return;
    }
    setSavingFollowup(true);
    try {
      await api.post(`/customers/${id}/followups`, followupData);
      toast.success('Follow-up added successfully');
      setFollowupData({ notes: '', followup_date: '' });
      setShowFollowupForm(false);
      fetchFollowups();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add follow-up');
    } finally {
      setSavingFollowup(false);
    }
  };

  if (loading || !customer) return <LoadingState />;

  const statusColor = customer.status === 'ACTIVE'
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]'
    : customer.status === 'LEAD'
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]'
    : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';

  const followupColumns = [
    { header: 'Date', accessor: (row: any) => <span className="text-zinc-400">{new Date(row.followup_date).toLocaleDateString()}</span> },
    { header: 'Notes', accessor: 'notes' },
    { header: 'Added By', accessor: (row: any) => <span className="text-zinc-400">{row.first_name || ''} {row.last_name || ''}</span> },
    { header: 'Created', accessor: (row: any) => <span className="text-zinc-500 text-xs">{new Date(row.created_at).toLocaleString()}</span> },
  ];

  const canEdit = user && ['ADMIN', 'SALES'].includes(user.role);
  const canDelete = user && user.role === 'ADMIN';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigate('/customers')} className="p-2 text-zinc-400 hover:text-white bg-white/5 border-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white font-display">{customer.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${statusColor}`}>
                {customer.status}
              </span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{customer.customer_type}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          {canEdit && (
            <Link to={`/customers/${id}/edit`}>
              <Button variant="secondary">
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
            </Link>
          )}
          {canDelete && (
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              <Trash2 className="w-4 h-4 mr-2" /> {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="card">
        <div className="card-header border-b border-white/10">
          <h3 className="card-title font-display">Customer Information</h3>
        </div>
        <div className="card-body grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-black/20">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Name</p>
              <p className="mt-1 text-white font-medium">{customer.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email</p>
              <p className="mt-1 text-white">{customer.email || '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Mobile</p>
              <p className="mt-1 text-white">{customer.mobile || '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Business</p>
              <p className="mt-1 text-white">{customer.business_name || '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">GST Number</p>
              <p className="mt-1 text-white font-mono text-sm">{customer.gst_number || '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Address</p>
              <p className="mt-1 text-white">{customer.address || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Follow-ups Section */}
      <div className="card">
        <div className="card-header border-b border-white/10 flex items-center justify-between">
          <h3 className="card-title font-display">Follow-up History</h3>
          {canEdit && (
            <Button size="sm" onClick={() => setShowFollowupForm(!showFollowupForm)} variant="secondary" className="bg-white/5 border-white/10 text-white hover:bg-white/10 shadow-none">
              <Plus className="w-4 h-4 mr-2" /> Add Follow-up
            </Button>
          )}
        </div>

        {/* Inline Follow-up Form */}
        {showFollowupForm && (
          <form onSubmit={handleAddFollowup} className="p-6 border-b border-white/10 bg-white/[0.02] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Follow-up Date *</label>
                <input
                  type="date"
                  value={followupData.followup_date}
                  onChange={(e) => setFollowupData({ ...followupData, followup_date: e.target.value })}
                  required
                  className="block w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all duration-300 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Notes *</label>
              <textarea
                rows={3}
                value={followupData.notes}
                onChange={(e) => setFollowupData({ ...followupData, notes: e.target.value })}
                required
                placeholder="Enter follow-up notes..."
                className="block w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all duration-300 sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={() => setShowFollowupForm(false)}>Cancel</Button>
              <Button type="submit" disabled={savingFollowup}>{savingFollowup ? 'Saving...' : 'Save Follow-up'}</Button>
            </div>
          </form>
        )}

        <div className="p-0">
          <Table
            data={followups}
            columns={followupColumns}
            keyExtractor={(row: any) => row.id}
            emptyMessage="No follow-ups recorded for this customer yet."
          />
        </div>
      </div>
    </div>
  );
};
