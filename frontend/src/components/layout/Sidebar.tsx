import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Warehouse, FileText, X, Hexagon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const toggle = () => setMobileMenuOpen(!mobileMenuOpen);
  
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { to: '/customers', icon: Users, label: 'Customers', roles: ['ADMIN', 'SALES', 'ACCOUNTS'] },
    { to: '/inventory', icon: Warehouse, label: 'Inventory', roles: ['ADMIN', 'WAREHOUSE'] },
    { to: '/challans', icon: FileText, label: 'Sales Challans', roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
  ].filter(item => user && item.roles.includes(user.role));

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Floating Island Sidebar */}
      <div 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0
          bg-black/20 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] lg:rounded-[2rem] 
          flex flex-col h-full lg:h-[calc(100vh-4rem)] my-0 lg:my-auto
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Subtle inner highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-purple-600/20 border border-brand-500/30 flex items-center justify-center">
              <Hexagon className="w-5 h-5 text-brand-400 fill-brand-400/20 animate-spin-slow" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight font-display">InfoTech</span>
          </div>
          <button onClick={toggle} className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 py-6 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Overview</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={toggle}
                className={({ isActive }) => 
                  `group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden ${
                    isActive 
                      ? 'text-white shadow-[0_0_20px_rgba(79,70,229,0.15)] bg-white/10 border border-white/10' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`
                }
              >
                {/* Active Neon Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-3/4 bg-brand-500 rounded-r-full shadow-[0_0_10px_rgba(79,70,229,0.8)]" />
                )}

                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <Icon className={`w-5 h-5 mr-3 flex-shrink-0 relative z-10 transition-colors duration-300 ${isActive ? 'text-brand-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span className="relative z-10">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};
