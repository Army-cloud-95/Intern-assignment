'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  Settings,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Projects Hub', href: '/projects', icon: FolderKanban },
    { name: 'Tasks Board', href: '/tasks', icon: CheckSquare, badge: 'Live' },
    { name: 'Team Directory', href: '/team', icon: Users },
    { name: 'Analytics & Reports', href: '/analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 glass-panel border-r border-slate-800/80 bg-slate-950/95 flex flex-col justify-between p-4 select-none transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header & Mobile Close */}
          <div className="flex items-center justify-between px-3 py-4 mb-4 border-b border-slate-800/60 lg:border-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-glow-cyan">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-2xl tracking-wider text-white">NOVA</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                    v2.4
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">Plan. Collaborate. Deliver.</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="space-y-6">
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Main Platform</p>
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => onMobileClose && onMobileClose()}
                      className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/10 to-transparent text-cyan-300 border border-cyan-500/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-cyan-400 to-indigo-500 shadow-glow-cyan" />
                      )}

                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400 shadow-glow-cyan' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span className="tracking-wide">{item.name}</span>
                      </div>

                      {item.badge ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {item.badge}
                        </span>
                      ) : (
                        <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-cyan-400 opacity-100' : 'text-slate-500'}`} />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Pro Features Card & Profile */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border border-indigo-500/30 relative overflow-hidden shadow-lg">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold mb-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400 fill-cyan-400/20 animate-pulse" />
              <span>AI Copilot Engine</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Task dispatching & workload optimization active.
            </p>
            <div className="flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SOC-2 Verified</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Alex Vance"
                className="w-8 h-8 rounded-full ring-2 ring-cyan-500/50 object-cover"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">Alex Vance</p>
                <p className="text-[10px] text-cyan-400 font-semibold truncate">Lead Architect</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
