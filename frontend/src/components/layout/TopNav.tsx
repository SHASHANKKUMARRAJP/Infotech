import React from 'react';
import { Menu, LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface TopNavProps {
  setMobileMenuOpen: (open: boolean) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ setMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-[#020202]/70 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="px-6 py-4 flex items-center justify-between sm:px-8">
        <div className="flex-1 flex items-center">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden -ml-2 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.8)] animate-pulse"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-white">{user?.first_name} {user?.last_name}</span>
              <span className="text-xs text-zinc-400 uppercase tracking-wider">{user?.role}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              <span className="text-white font-bold tracking-wider">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="ml-2 p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
