'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, changeType = 'positive', icon: Icon, color = 'cyan', subtitle }) {
  const colorMap = {
    cyan: {
      borderTop: 'border-t-cyan-500',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-glow-cyan',
      text: 'text-cyan-400'
    },
    indigo: {
      borderTop: 'border-t-indigo-500',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-glow-purple',
      text: 'text-indigo-400'
    },
    emerald: {
      borderTop: 'border-t-emerald-500',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-glow-emerald',
      text: 'text-emerald-400'
    },
    amber: {
      borderTop: 'border-t-amber-500',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      text: 'text-amber-400'
    },
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div className={`glass-card rounded-2xl p-5 border border-slate-800 ${scheme.borderTop} border-t-2 relative overflow-hidden group`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
        <div className={`p-2.5 rounded-xl border ${scheme.iconBg} transition-transform group-hover:scale-110 duration-300`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold text-white tracking-tight font-sans">{value}</h3>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
            changeType === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {changeType === 'positive' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-2 font-medium">{subtitle}</p>
      )}
    </div>
  );
}
