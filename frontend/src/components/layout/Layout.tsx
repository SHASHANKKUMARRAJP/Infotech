import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { Toaster } from 'react-hot-toast';

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex p-4 sm:p-6 lg:p-8 space-x-0 lg:space-x-6 relative text-zinc-100 bg-[#050505] overflow-hidden">
      
      {/* Dynamic Animated Background Glows */}
      <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-[100%] h-[70%] rounded-full bg-brand-600/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[100%] h-[70%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse-slow delay-1000" />
      </div>
      
      {/* Detached, Floating Sidebar */}
      <Sidebar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      {/* Main Floating Content Island */}
      <div className="flex-1 flex flex-col min-w-0 bg-black/20 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden relative z-10">
        
        {/* Subtle inner top highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

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
