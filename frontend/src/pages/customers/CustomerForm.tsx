import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import toast from 'react-hot-toast';
import { LoadingState } from '../../components/ui/LoadingState';

export const CustomerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    business_name: '',
    gst_number: '',
    customer_type: 'RETAIL',
    status: 'LEAD',
    address: '',
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/customers/${id}`)
        .then(res => {
          setFormData(res.data);
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load customer');
          navigate('/customers');
        });
    }
  }, [id, navigate, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/customers/${id}`, formData);
        toast.success('Customer updated successfully');
      } else {
        await api.post('/customers', formData);
        toast.success('Customer created successfully');
      }
      navigate('/customers');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save customer');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="page-container max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-100">{isEdit ? 'Edit Customer' : 'New Customer'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-body space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input label="Name *" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
          <Input label="Mobile *" name="mobile" value={formData.mobile} onChange={handleChange} required />
          <Input label="Business Name" name="business_name" value={formData.business_name} onChange={handleChange} />
          <Input label="GST Number" name="gst_number" value={formData.gst_number} onChange={handleChange} />
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5 ml-1">Customer Type</label>
            <Select
              value={formData.customer_type}
              onChange={(value) => setFormData({ ...formData, customer_type: value })}
              options={[
                { value: 'RETAIL', label: 'Retail' },
                { value: 'WHOLESALE', label: 'Wholesale' },
                { value: 'DISTRIBUTOR', label: 'Distributor' }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5 ml-1">Status</label>
            <Select
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
              options={[
                { value: 'LEAD', label: 'Lead' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' }
              ]}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5 ml-1">Address</label>
          <textarea
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all duration-300 shadow-sm sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-100">
          <Button type="button" variant="secondary" onClick={() => navigate('/customers')}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Customer'}</Button>
        </div>
        </div>
      </form>
    </div>
  );
};
