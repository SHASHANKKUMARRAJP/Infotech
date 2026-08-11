import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { Toaster } from 'react-hot-toast';

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex text-zinc-100 bg-[#050505] overflow-hidden">
      
      {/* Dynamic Animated Background Glows */}
      <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-[100%] h-[70%] rounded-full bg-brand-600/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[100%] h-[70%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse-slow delay-1000" />
      </div>
      
      {/* Seamless Sidebar */}
      <Sidebar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] border-l border-white/5 relative z-10 overflow-hidden">
        

        <TopNav setMobileMenuOpen={setMobileMenuOpen} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-10 hide-scrollbar">
          <Outlet />
        </main>
      </div>

      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'bg-zinc-900 text-zinc-100 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] rounded-xl backdrop-blur-md',
          duration: 4000,
        }} 
      />
    </div>
  );
};
