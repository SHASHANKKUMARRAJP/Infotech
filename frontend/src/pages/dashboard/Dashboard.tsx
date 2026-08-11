import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, FileText, TrendingUp, Activity, CheckCircle, Clock, ChevronRight, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/dashboard');
        setMetrics(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard metrics:', err);
      }
    };
    fetchMetrics();
    setMounted(true);
  }, []);

  const navigate = useNavigate();

  const allStats = [
    { label: 'Total Customers', value: metrics?.totalCustomers ?? '...', icon: Users, color: 'text-amber-300', bgGlow: 'from-amber-500/20 to-orange-500/5', roles: ['ADMIN', 'SALES', 'ACCOUNTS'], path: '/customers' },
    { label: 'Total Products', value: metrics?.totalProducts ?? '...', icon: Package, color: 'text-emerald-300', bgGlow: 'from-emerald-500/20 to-teal-500/5', roles: ['ADMIN', 'WAREHOUSE'], path: '/products' },
    { label: 'Total Stock', value: metrics?.totalStock ?? '...', icon: CheckCircle, color: 'text-blue-300', bgGlow: 'from-blue-500/20 to-indigo-500/5', roles: ['ADMIN', 'WAREHOUSE'], path: '/inventory' },
    { label: 'Low Stock Alerts', value: metrics?.lowStockProducts ?? '...', icon: Activity, color: 'text-red-300', bgGlow: 'from-red-500/20 to-pink-500/5', roles: ['ADMIN', 'WAREHOUSE'], path: '/products' },
    { label: 'Sales Challans', value: 'Manage', icon: FileText, color: 'text-purple-300', bgGlow: 'from-purple-500/20 to-fuchsia-500/5', roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'], path: '/challans' }
  ];

  const stats = allStats.filter(stat => user && stat.roles.includes(user.role));

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16 pt-4">
      
      {/* Luxury Hero Section */}
      <div className={`relative rounded-[2rem] overflow-hidden min-h-[360px] sm:h-[400px] border border-white/5 shadow-2xl transition-all duration-1000 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        {/* Background Base */}
        <div className="absolute inset-0 bg-[#030303] z-0" />
        
        {/* Thematic Enterprise Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2000&q=80" 
            alt="Corporate Tech Dashboard" 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity animate-zoom-slow"
          />
        </div>

        {/* Abstract animated gradient meshes */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[140%] rounded-full bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent blur-[80px] z-0 mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[100%] rounded-full bg-gradient-to-tr from-blue-500/10 via-purple-500/5 to-transparent blur-[80px] z-0 mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Fine grid overlay for premium texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] z-0"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 z-20">
          <div className="flex flex-col space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-max backdrop-blur-md mb-2">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-amber-100/80 tracking-widest uppercase">Premium Workspace</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight leading-[1.1]">
              <span className="text-white/90">Elevate your </span>
              <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-300 drop-shadow-sm">
                enterprise today.
              </span>
            </h1>
            
            <p className="text-zinc-400 text-lg sm:text-xl font-light tracking-wide max-w-2xl mt-4">
              Welcome back, <span className="text-white font-medium">{user?.first_name}</span>. Experience seamless control over your modules with real-time insights.
            </p>
          </div>
        </div>

        {/* Glossy overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent h-1/2 pointer-events-none z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 40%)' }}></div>
      </div>

      {/* Luxury Modules Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const CardContent = (
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgGlow} border border-white/10 backdrop-blur-md shadow-inner`}>
                  <Icon className={`w-7 h-7 ${stat.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`} />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  <ChevronRight className="w-5 h-5 text-white/50" />
                </div>
              </div>
              
              <div>
                <dt className="text-xs font-semibold text-zinc-500 tracking-[0.2em] uppercase mb-2">{stat.label}</dt>
                <dd className="text-3xl font-bold font-display tracking-tight text-white group-hover:text-amber-100 transition-colors">{stat.value}</dd>
              </div>
            </div>
          );

          return stat.path ? (
            <button 
              key={idx} 
              onClick={() => navigate(stat.path!)}
              className={`relative text-left bg-[#080808]/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 overflow-hidden group transition-all duration-700 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]`}
              style={{ transitionDelay: `${300 + idx * 150}ms` }}
            >
              {/* Hover Glow */}
              <div className={`absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2rem] bg-gradient-to-r ${stat.bgGlow} blur-xl -z-10`} />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] group-hover:bg-white/10 transition-colors"></div>
              
              {CardContent}
              
              {/* Subtle inner border for premium feel */}
              <div className="absolute inset-0 rounded-[2rem] border border-white/5 pointer-events-none group-hover:border-white/10 transition-colors"></div>
            </button>
          ) : (
            <div 
              key={idx} 
              className={`relative bg-[#080808]/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 overflow-hidden transition-all duration-700 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${300 + idx * 150}ms` }}
            >
              {CardContent}
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Luxury Analytics Card */}
        <div className={`lg:col-span-2 bg-[#080808]/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 sm:p-10 min-h-[450px] flex flex-col relative overflow-hidden transition-all duration-1000 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: '700ms' }}>
          {/* Ambient Glow */}
          <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[60%] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-16 relative z-10 gap-4">
            <div>
              <h3 className="text-3xl font-bold text-white font-display tracking-tight">Revenue Dynamics</h3>
              <p className="text-zinc-500 mt-2 font-light text-sm">Monthly recurring revenue (MRR) trajectory and insights.</p>
            </div>
            <div className="flex items-center space-x-3 bg-black/40 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span className="text-sm font-medium text-amber-100 tracking-wide">Live Telemetry</span>
            </div>
          </div>

          {/* Premium CSS Chart */}
          <div className="flex-1 flex items-end justify-between space-x-2 sm:space-x-8 relative z-10 h-64 mt-auto border-b border-white/5 pb-6">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {[40, 60, 45, 80, 55, 90, 75, 100].map((height, idx) => (
              <div key={idx} className="relative flex flex-col items-center flex-1 group h-full justify-end">
                {/* Tooltip */}
                <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-2 bg-[#111] border border-amber-500/30 text-amber-100 text-sm font-medium py-2 px-4 rounded-xl whitespace-nowrap pointer-events-none z-20 shadow-[0_10px_30px_rgba(245,158,11,0.2)] backdrop-blur-xl">
                  ${(height * 1.5).toFixed(1)}k
                  <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#111] border-b border-r border-amber-500/30 rotate-45"></div>
                </div>
                
                {/* Bar */}
                <div 
                  className="w-full max-w-[56px] relative overflow-visible group-hover:scale-y-[1.02] transition-transform origin-bottom"
                  style={{ 
                    height: `${height}%`,
                    animation: `barGrow 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                    animationDelay: `${800 + idx * 100}ms`,
                    opacity: 0
                  }}
                >
                  {/* Neon Glow under bar */}
                  <div className="absolute inset-0 bg-amber-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                  
                  {/* Main Bar body */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-zinc-800 to-zinc-600 rounded-t-xl group-hover:from-[#222] group-hover:via-amber-900/40 group-hover:to-amber-400/80 transition-all duration-300 border border-white/5 border-b-0">
                    {/* Glossy reflection line */}
                    <div className="absolute top-0 left-0 right-0 h-full w-1/3 bg-gradient-to-r from-white/10 to-transparent rounded-tl-xl mix-blend-overlay"></div>
                  </div>
                  
                  {/* Top cap */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20 rounded-t-xl group-hover:bg-amber-300 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:shadow-[0_0_15px_rgba(251,191,36,0.8)]"></div>
                </div>
                
                <span className="absolute -bottom-10 text-sm tracking-wider text-zinc-500 font-medium group-hover:text-amber-200 transition-colors">
                  {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Luxury Activity Feed */}
        <div className={`bg-[#080808]/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 transition-all duration-1000 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: '850ms' }}>
          <div className="flex items-center space-x-4 mb-10 border-b border-white/5 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-[#111] border border-white/10 flex items-center justify-center shadow-inner">
              <Activity className="w-6 h-6 text-zinc-300" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display tracking-tight">Recent Log</h3>
          </div>
          
          <div className="space-y-8 relative">
            <div className="absolute top-2 bottom-2 left-[19px] w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
            
            {(() => {
              if (!metrics) return null;
              
              const combinedLogs: any[] = [];
              metrics.recentChallans.forEach((c: any) => {
                combinedLogs.push({
                  text: `Challan ${c.challan_number} (${c.status}) for ${c.customer_name}`,
                  date: new Date(c.created_at),
                  icon: FileText,
                  color: "text-amber-400 bg-amber-400/10 border-amber-400/30"
                });
              });
              metrics.recentStockMovements.forEach((m: any) => {
                combinedLogs.push({
                  text: `Stock ${m.movement_type} (${m.quantity}) for ${m.product_name}`,
                  date: new Date(m.created_at),
                  icon: Package,
                  color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
                });
              });
              
              combinedLogs.sort((a, b) => b.date.getTime() - a.date.getTime());
              
              return combinedLogs.slice(0, 5).map((activity, idx) => {
                const Icon = activity.icon;
                return (
                  <div key={idx} className="flex gap-6 relative z-10 group cursor-pointer">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border backdrop-blur-md ${activity.color} ring-4 ring-[#080808] group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-4 h-4 drop-shadow-md" />
                    </div>
                    <div className="flex-1 pb-4 group-hover:translate-x-1 transition-transform duration-300">
                      <p className="text-base font-medium text-zinc-300 group-hover:text-white transition-colors">{activity.text}</p>
                      <p className="text-xs text-zinc-600 mt-1.5 font-medium tracking-wide uppercase">{activity.date.toLocaleString()}</p>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
          
          <button className="w-full mt-6 py-4 rounded-xl border border-white/5 bg-white/5 text-sm font-medium text-zinc-400 hover:bg-white/10 hover:text-white transition-all duration-300">
            View All Logs
          </button>
        </div>

      </div>
    </div>
  );
};
