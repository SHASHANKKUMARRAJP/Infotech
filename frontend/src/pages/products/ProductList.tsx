import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import api from '../../lib/api';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingState } from '../../components/ui/LoadingState';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (currentPage = 1, searchQuery = '', isLowStock = false) => {
    try {
      setLoading(true);
      const res = await api.get(`/products?page=${currentPage}&limit=10&search=${searchQuery}${isLowStock ? '&low_stock=true' : ''}`);
      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, search, lowStock);
  }, [page, lowStock]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(1, search, lowStock);
  };

  const columns = [
    { header: 'Product Name', accessor: 'product_name' },
    { header: 'SKU', accessor: 'sku' },
    { header: 'Category', accessor: (row: any) => row.category || '-' },
    { header: 'Price', accessor: (row: any) => <span className="text-emerald-400 font-medium">${Number(row.unit_price).toFixed(2)}</span> },
    { 
      header: 'Stock', 
      accessor: (row: any) => (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${row.current_stock <= row.minimum_stock_quantity ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(220,38,38,0.15)] animate-pulse-slow' : 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20'}`}>
          {row.current_stock}
        </span>
      )
    },
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <div className="flex space-x-3">
          <Link to={`/products/${row.id}/edit`} className="text-brand-400 hover:text-brand-300 font-medium transition-colors hover:underline">Edit</Link>
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
          src="https://images.unsplash.com/photo-1586528116311-ad8ed7c8d20f?auto=format&fit=crop&w=2000&q=80" 
          alt="Products Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-display tracking-tight">Product Catalog</h1>
              <p className="mt-2 text-zinc-400 max-w-xl">Manage your inventory catalog, set pricing, and monitor stock thresholds.</p>
            </div>
            <Link to="/products/new" className="hidden sm:block">
              <Button size="lg" className="shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <Plus className="w-5 h-5 mr-2" /> Add Product
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        <form onSubmit={handleSearch} className="w-full sm:w-96 flex space-x-3">
          <Input 
            placeholder="Search by name or SKU..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            <Search className="w-5 h-5" />
          </Button>
        </form>
        
        <label className="flex items-center space-x-3 text-sm font-medium text-zinc-300 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
          <input 
            type="checkbox" 
            checked={lowStock} 
            onChange={(e) => {
              setLowStock(e.target.checked);
              setPage(1);
            }}
            className="w-4 h-4 rounded border-white/20 bg-black/50 text-brand-500 focus:ring-brand-500/50 focus:ring-offset-0"
          />
          <span>Show Low Stock Only</span>
        </label>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <div className="space-y-4">
          <Table 
            data={products} 
            columns={columns} 
            keyExtractor={(row: any) => row.id} 
            emptyMessage="No products found matching your criteria."
          />
          
          {totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between sm:px-6">
              <div className="flex-1 flex justify-between">
                <Button 
                  variant="secondary" 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-700 self-center">
                  Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                </span>
                <Button 
                  variant="secondary" 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
