import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-zinc-300 mb-1.5 ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            block w-full px-4 py-2.5 rounded-xl border bg-black/40 backdrop-blur-md
            text-zinc-100 placeholder-zinc-500
            focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500
            transition-all duration-300 shadow-sm sm:text-sm
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-white/10 hover:border-white/20'}
            disabled:bg-white/5 disabled:text-zinc-600
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
