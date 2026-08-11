import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-16 space-y-4 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full"></div>
        <Loader2 className="w-10 h-10 text-brand-400 animate-spin relative z-10" />
      </div>
      <p className="text-zinc-400 font-medium tracking-wide">Loading data...</p>
    </div>
  );
};
