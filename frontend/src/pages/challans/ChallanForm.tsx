import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { LoadingState } from '../../components/ui/LoadingState';
import toast from 'react-hot-toast';

export const ChallanForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, prodRes] = await Promise.all([
          api.get('/customers?limit=1000'), // Get all for dropdown
          api.get('/products?limit=1000') // Get all for dropdown
        ]);
        setCustomers(custRes.data.data);
        setProducts(prodRes.data.data);
      } catch (error) {
        toast.error('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { product_id: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      toast.error('Please select a customer');
      return;
    }
    
    // Filter out invalid items
    const validItems = items.filter(item => item.product_id && item.quantity > 0);
    if (validItems.length === 0) {
      toast.error('Please add at least one valid product');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        customer_id: customerId,
        items: validItems
      };
      const res = await api.post('/challans', payload);
      toast.success('Draft Challan created successfully');
      navigate(`/challans/${res.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create challan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="page-container max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-100">New Sales Challan</h1>
        <p className="mt-1 text-sm text-zinc-400">Create a new draft challan for a customer order</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card card-body">
          <label className="block text-sm font-medium text-zinc-300 mb-1.5 ml-1">Select Customer *</label>
          <Select
            value={customerId}
            onChange={(val) => setCustomerId(val)}
            placeholder="-- Choose a customer --"
            options={customers.map((c: any) => ({
              value: c.id,
              label: `${c.name} (${c.email})`
            }))}
          />
        </div>

        <div className="card card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-zinc-100">Line Items</h3>
            <Button type="button" size="sm" onClick={handleAddItem} variant="secondary">
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <Select
                    value={item.product_id}
                    onChange={(val) => handleItemChange(index, 'product_id', val)}
                    placeholder="-- Select Product --"
                    options={products.map((p: any) => ({
                      value: p.id,
                      label: `${p.sku} - ${p.product_name} (Stock: ${p.current_stock})`
                    }))}
                  />
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10) || 1)}
                    required
                    className="block w-full px-4 py-3.5 rounded-xl border border-white/10 bg-[#111111] text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-300 shadow-sm sm:text-sm"
                    placeholder="Qty"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  disabled={items.length === 1}
                  className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/challans')}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create Draft Challan'}</Button>
        </div>
      </form>
    </div>
  );
};
