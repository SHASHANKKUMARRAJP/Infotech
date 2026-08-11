import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Shield, Zap, Box, Users, BarChart3, CheckCircle2 } from 'lucide-react';

export const Landing: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-brand-500/30 font-sans relative">
      {/* Dynamic Background Glow & Atmosphere */}
      <div className="fixed inset-0 z-0 flex justify-center items-center pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-600/20 blur-[120px] animate-pulse-slow mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse-slow delay-1000 mix-blend-screen" />
      </div>
      
      {/* Grid Overlay for Technical Vibe */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay pointer-events-none"></div>
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] z-0 pointer-events-none"></div>

      <nav className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold font-display">IE</span>
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-white">InfoTech</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Testimonials</a>
          </div>
          <div>
            <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors mr-6">
              Sign in
            </Link>
            <Link to="/login" className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-sm text-brand-200 transition-all duration-700 transform backdrop-blur-md shadow-[0_0_20px_rgba(79,70,229,0.2)] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
            <span className="font-medium tracking-wide uppercase text-xs">Infotech Enterprise 2.0 is now live</span>
          </div>

          <h1 className={`text-5xl md:text-7xl font-bold font-display tracking-tighter leading-[1.1] transition-all duration-700 delay-100 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="text-white">Manage your business with </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-300 via-purple-400 to-brand-500 drop-shadow-sm">absolute precision.</span>
          </h1>

          <p className={`text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto transition-all duration-700 delay-200 transform font-light ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            The ultra-premium ERP and CRM platform designed for modern enterprises. Handle inventory, sales, and customers at the speed of thought.
          </p>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 transition-all duration-700 delay-300 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold hover:from-brand-500 hover:to-purple-500 transition-all flex items-center justify-center group shadow-[0_10px_40px_-10px_rgba(79,70,229,0.8)] hover:shadow-[0_15px_50px_-10px_rgba(79,70,229,1)]">
              Start Building
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white font-medium hover:bg-white/10 transition-all text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              Explore Features
            </a>
          </div>
        </div>

        {/* Hero Image Mockup with Perspective */}
        <div className={`mt-24 relative mx-auto max-w-5xl transition-all duration-1000 delay-500 transform perspective-1000 ${mounted ? 'opacity-100 translate-y-0 rotate-x-0' : 'opacity-0 translate-y-16 rotate-x-12'}`} style={{ perspective: '2000px' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10 bottom-0 top-1/2 pointer-events-none" />
          <div 
            className="rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(99,102,241,0.2)] relative group"
            style={{ transform: 'rotateX(5deg) scale(0.95)', transformStyle: 'preserve-3d', boxShadow: '0 50px 100px -20px rgba(0,0,0,1)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay z-20 pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-20"></div>
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80" alt="Dashboard Interface Mockup" className="w-full h-auto object-cover opacity-90 brightness-110 contrast-125" />
          </div>
        </div>

        {/* LOGO CLOUD */}
        <div className="mt-32 pt-16 border-t border-white/5 text-center">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-8">Trusted by innovative teams worldwide</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder company names acting as logos */}
            <span className="text-2xl font-bold font-display">ACME Corp</span>
            <span className="text-2xl font-bold font-display">Stark Ind.</span>
            <span className="text-2xl font-bold font-display">Globex</span>
            <span className="text-2xl font-bold font-display">Soylent</span>
            <span className="text-2xl font-bold font-display">Initech</span>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div id="features" className="mt-40">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Everything you need to scale</h2>
            <p className="text-zinc-400 text-lg">We provide a comprehensive suite of tools designed specifically to handle complex business operations with absolute simplicity.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Box, title: "Inventory Management", desc: "Track stock levels in real-time. Get automated low-stock alerts and comprehensive movement history logs." },
              { icon: Users, title: "Customer CRM", desc: "Manage leads, active clients, and communication history in one unified interface." },
              { icon: BarChart3, title: "Sales Challans", desc: "Generate, track, and manage sales challans instantly. Convert drafts to confirmed orders with one click." },
              { icon: Zap, title: "Lightning Fast", desc: "Built on modern edge architecture ensuring sub-second response times for all critical operations." },
              { icon: Shield, title: "Enterprise Security", desc: "Bank-level encryption and role-based access controls to keep your proprietary business data completely safe." },
              { icon: Activity, title: "Real-time Analytics", desc: "Monitor your KPIs, revenue growth, and sales metrics instantly with our dynamic dashboard." }
            ].map((feature, i) => (
              <div 
                key={i}
                className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a]/50 backdrop-blur-3xl hover:bg-[#111]/80 transition-all duration-500 hover:-translate-y-2 group cursor-pointer relative overflow-hidden shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)]"
              >
                {/* Interactive Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-purple-500/0 to-brand-500/0 group-hover:from-brand-500/10 group-hover:via-purple-500/5 group-hover:to-transparent transition-all duration-700 opacity-0 group-hover:opacity-100" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-[50px] group-hover:bg-brand-500/30 group-hover:scale-150 transition-all duration-700" />
                
                {/* Inner Border Gloss */}
                <div className="absolute inset-0 rounded-[2rem] border border-white/0 group-hover:border-white/10 transition-colors duration-500 pointer-events-none"></div>

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#111] to-[#222] flex items-center justify-center mb-8 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-500 relative z-10">
                  <feature.icon className="w-7 h-7 text-brand-400 group-hover:text-brand-300 transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold font-display tracking-tight text-white mb-4 relative z-10">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed font-light relative z-10">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS (Alternating Sections) */}
        <div id="how-it-works" className="mt-40 space-y-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">A workflow that makes sense</h2>
            <p className="text-zinc-400 text-lg">Stop fighting with clunky legacy software. Infotech flows exactly how your business operates.</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-sm font-medium border border-brand-500/20">
                Step 1
              </div>
              <h3 className="text-3xl font-bold">Onboard Customers Instantly</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Add leads and customers to your database in seconds. Track their business type, GST information, and contact details seamlessly. Search through thousands of records instantly.
              </p>
              <ul className="space-y-3 pt-4">
                {["Categorize as Retail or Wholesale", "Track active vs inactive leads", "Instant search indexing"].map((item, i) => (
                  <li key={i} className="flex items-center text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-brand-500 mr-3" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full perspective-1000" style={{ perspective: '2000px' }}>
              <div 
                className="aspect-video rounded-3xl border border-white/10 bg-[#0a0a0a]/80 p-2 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative group transform transition-transform duration-700 hover:rotate-x-0 hover:rotate-y-0"
                style={{ transform: 'rotateY(-10deg) rotateX(5deg)', transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"></div>
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80" alt="Team meeting" className="w-full h-full object-cover rounded-2xl opacity-80 brightness-110 contrast-125" />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium border border-purple-500/20">
                Step 2
              </div>
              <h3 className="text-3xl font-bold">Manage Infinite Inventory</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Add products, set minimum stock thresholds, and track every single movement. Our system logs every stock in and out, creating an immutable audit trail for your warehouse.
              </p>
              <ul className="space-y-3 pt-4">
                {["Automated low stock alerts", "Detailed movement audit logs", "Multi-warehouse tracking"].map((item, i) => (
                  <li key={i} className="flex items-center text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 mr-3" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full perspective-1000" style={{ perspective: '2000px' }}>
              <div 
                className="aspect-video rounded-3xl border border-white/10 bg-[#0a0a0a]/80 p-2 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative group transform transition-transform duration-700 hover:rotate-x-0 hover:rotate-y-0"
                style={{ transform: 'rotateY(10deg) rotateX(5deg)', transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 bg-gradient-to-tl from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"></div>
                <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80" alt="Warehouse operations" className="w-full h-full object-cover rounded-2xl opacity-80 brightness-110 contrast-125" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="mt-40 relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-600/10 to-transparent" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold font-display">Ready to upgrade your enterprise?</h2>
            <p className="text-xl text-zinc-400">Join the thousands of forward-thinking companies that rely on Infotech to run their daily operations.</p>
            <div className="flex justify-center">
              <Link to="/login" className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-all flex items-center shadow-xl hover:scale-105 active:scale-95 duration-200">
                Create your free account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/50 py-12 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold font-display">IE</span>
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-white">InfoTech</span>
          </div>
          <div className="text-sm text-zinc-500">
            © 2026 Infotech Enterprise. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
