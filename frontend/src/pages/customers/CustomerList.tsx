import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import api from '../../lib/api';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingState } from '../../components/ui/LoadingState';

export const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = async (currentPage = 1, searchQuery = '') => {
    try {
      setLoading(true);
      const res = await api.get(`/customers?page=${currentPage}&limit=10&search=${searchQuery}`);
      setCustomers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(page, search);
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers(1, search);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Business', accessor: (row: any) => row.business_name || '-' },
    { header: 'Email', accessor: 'email' },
    { header: 'Mobile', accessor: 'mobile' },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border 
          ${row.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]' : 
            row.status === 'LEAD' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]' : 
            'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
          {row.status}
        </span>
      )
    },
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <div className="flex space-x-3">
          <Link to={`/customers/${row.id}`} className="text-brand-400 hover:text-brand-300 font-medium transition-colors hover:underline">View</Link>
          <Link to={`/customers/${row.id}/edit`} className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline">Edit</Link>
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
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=80" 
          alt="Customers Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-display tracking-tight">Customers Directory</h1>
              <p className="mt-2 text-zinc-400 max-w-xl">Manage your client relationships, track leads, and oversee active accounts.</p>
            </div>
            <Link to="/customers/new" className="hidden sm:block">
              <Button size="lg" className="shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <Plus className="w-5 h-5 mr-2" /> Add Customer
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        <form onSubmit={handleSearch} className="w-full sm:w-96 flex space-x-3">
          <Input 
            placeholder="Search by name, email, or mobile..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            <Search className="w-5 h-5" />
          </Button>
        </form>
        <Link to="/customers/new" className="sm:hidden w-full">
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Customer
          </Button>
        </Link>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <div className="space-y-4">
          <Table 
            data={customers} 
            columns={columns} 
            keyExtractor={(row: any) => row.id} 
            emptyMessage="No customers found matching your criteria."
          />
          
          {/* Pagination */}
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
