import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { LoadingState } from '../../components/ui/LoadingState';

export const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    product_name: '',
    sku: '',
    category: '',
    description: '',
    unit_price: '',
    minimum_stock_quantity: 0,
    warehouse_location: '',
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`)
        .then(res => {
          setFormData(res.data);
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load product');
          navigate('/products');
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
      const payload = {
        ...formData,
        unit_price: parseFloat(formData.unit_price as string),
        minimum_stock_quantity: parseInt(String(formData.minimum_stock_quantity) || '0', 10),
      };

      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Product created successfully');
      }
      navigate('/products');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="page-container max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">{isEdit ? 'Edit Product' : 'New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-body space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input label="Product Name *" name="product_name" value={formData.product_name} onChange={handleChange} required />
          <Input label="SKU *" name="sku" value={formData.sku} onChange={handleChange} required />
          <Input label="Category" name="category" value={formData.category} onChange={handleChange} />
          <Input label="Unit Price *" name="unit_price" type="number" step="0.01" value={formData.unit_price} onChange={handleChange} required />
          <Input label="Minimum Stock Alert Level" name="minimum_stock_quantity" type="number" value={formData.minimum_stock_quantity} onChange={handleChange} />
          <Input label="Warehouse Location" name="warehouse_location" value={formData.warehouse_location} onChange={handleChange} />
        </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="block w-full px-3 py-2 rounded-md border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors shadow-sm sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-100">
            <Button type="button" variant="secondary" onClick={() => navigate('/products')}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</Button>
          </div>
        </div>
      </form>
    </div>
  );
};
