import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Hexagon, ArrowRight, Mail, Lock, ArrowLeft, Shield, User } from 'lucide-react';

export const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SALES');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.role-dropdown-container')) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { 
        email, 
        password, 
        first_name: firstName, 
        last_name: lastName,
        role 
      });
      login(res.data.token, res.data.user);
      toast.success('Account created successfully');
    } catch (err: any) {
      console.error('Registration error:', err);
      toast.error(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex font-sans overflow-hidden selection:bg-brand-500/30">
      
      {/* LEFT COLUMN: Register Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10 py-12 overflow-y-auto">
        
        {/* Dynamic Animated Background Glows (Left Side) */}
        <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-20%] w-[100%] h-[70%] rounded-full bg-brand-600/10 blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-20%] w-[100%] h-[70%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse-slow delay-1000" />
        </div>

        <div className="relative z-10 w-full max-w-sm mx-auto lg:max-w-md my-auto">
          
          <Link to="/" className={`inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors mb-8 duration-700 transform ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className={`flex flex-col transition-all duration-700 delay-100 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-600/20 border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
                <Hexagon className="w-6 h-6 text-brand-400 fill-brand-400/20 animate-spin-slow" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight font-display">InfoTech</h2>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight font-display mb-2">Create Account</h1>
            <p className="text-zinc-400">
              Join the enterprise workspace to get started.
            </p>
          </div>
          
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-2 gap-4">
              <div className={`relative transition-all duration-700 delay-200 transform ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 ml-1">First Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-300 hover:bg-white/[0.05]"
                    placeholder="John"
                  />
                </div>
              </div>

              <div className={`relative transition-all duration-700 delay-200 transform ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 ml-1">Last Name</label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-300 hover:bg-white/[0.05]"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div className={`relative transition-all duration-700 delay-300 transform ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 ml-1">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-300 hover:bg-white/[0.05]"
                  placeholder="john@minierp.com"
                />
              </div>
            </div>

            <div className={`relative transition-all duration-700 delay-400 transform ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-300 hover:bg-white/[0.05]"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className={`relative z-50 role-dropdown-container transition-all duration-700 delay-500 transform ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 ml-1">Select Role</label>
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex justify-between items-center w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-300 hover:bg-white/[0.05]"
              >
                <span>{role.charAt(0) + role.slice(1).toLowerCase()}</span>
                <svg className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              {isRoleDropdownOpen && (
                <div className="absolute z-20 w-full mt-2 bg-[#111111] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors ${role === r ? 'text-brand-400 font-medium bg-white/[0.02]' : 'text-zinc-300'}`}
                    >
                      {r.charAt(0) + r.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`pt-2 transition-all duration-700 delay-600 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <button
                type="submit"
                disabled={loading}
                className="w-full relative flex items-center justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-white/10 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-brand-500 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                
                {loading ? (
                  <div className="flex items-center relative z-10">
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Registering...
                  </div>
                ) : (
                  <span className="relative z-10 flex items-center">
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </div>

            <div className={`mt-6 text-center transition-all duration-700 delay-700 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-sm text-zinc-400">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
            
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Animated Image Showcase */}
      <div className={`hidden lg:block lg:flex-1 relative overflow-hidden transition-all duration-1000 transform origin-right ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-brand-900/20 mix-blend-overlay z-10" />
        
        {/* Animated Image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&w=2000&q=80" 
            alt="Modern Enterprise Logistics" 
            className="w-full h-full object-cover animate-zoom-slow opacity-40 mix-blend-lighten" 
          />
        </div>

        {/* Floating Glassmorphism Element */}
        <div className={`absolute bottom-20 right-20 z-20 transition-all duration-1000 delay-[800ms] transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm">
            <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/30 mb-4">
              <Shield className="w-6 h-6 text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Join the Network</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Register now to gain access to enterprise-grade tools, role-based workflows, and real-time business insights.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
