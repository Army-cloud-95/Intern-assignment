'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import { VelocityChart, StatusPieChart } from '@/components/Charts';
import { 
  FolderKanban, 
  CheckSquare, 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowUpRight, 
  AlertCircle, 
  Zap, 
  Activity,
  Flame,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [resA, resP, resT, resAct] = await Promise.all([
        fetch('/api/analytics').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/tasks').then(r => r.json()),
        fetch('/api/activities').then(r => r.json()),
      ]);
      setAnalytics(resA);
      setProjects(Array.isArray(resP) ? resP : []);
      setTasks(Array.isArray(resT) ? resT : []);
      setActivities(Array.isArray(resAct) ? resAct : []);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
                Executive Command Center
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              NOVA Workspace Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Managing 4 active engineering streams, 7 tasks, and real-time member velocity tracking across your productivity platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/tasks"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-cyan transition-all transform hover:scale-105 active:scale-95"
            >
              <span>Open Kanban Workflow</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Projects"
          value={analytics?.totalProjects || 4}
          change="+1 this month"
          changeType="positive"
          icon={FolderKanban}
          color="indigo"
          subtitle="4 engineering streams"
        />
        <StatCard
          title="Total Tasks"
          value={analytics?.totalTasks || 7}
          change="85% on schedule"
          changeType="positive"
          icon={CheckSquare}
          color="cyan"
          subtitle={`${analytics?.inProgressTasks || 2} in progress`}
        />
        <StatCard
          title="Completion Rate"
          value={`${analytics?.completionRate || 68}%`}
          change="+12% velocity"
          changeType="positive"
          icon={CheckCircle2}
          color="emerald"
          subtitle="Target threshold: >60%"
        />
        <StatCard
          title="Productivity Index"
          value="94.2"
          change="Top 5% team"
          changeType="positive"
          icon={Zap}
          color="amber"
          subtitle="Based on task lead times"
        />
      </div>

      {/* Main Visual Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sprint Execution Velocity Chart */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-white tracking-wide">Sprint Execution Velocity</h2>
              <p className="text-xs text-slate-400">Created vs Completed tasks across recent 5 sprint cycles</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold border border-slate-800">
              Weekly View
            </span>
          </div>
          <VelocityChart />
        </div>

        {/* Task Status Breakdown Chart */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-4 flex flex-col justify-between shadow-xl">
          <div>
            <h2 className="font-extrabold text-base text-white tracking-wide">Task Distribution</h2>
            <p className="text-xs text-slate-400">Proportional workflow status split</p>
          </div>
          <StatusPieChart breakdown={analytics?.statusBreakdown || []} />
          
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span>To Do: {analytics?.todoTasks || 2}</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow-cyan" />
              <span>Progress: {analytics?.inProgressTasks || 2}</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-glow-purple" />
              <span>Review: {analytics?.reviewTasks || 1}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-glow-emerald" />
              <span>Done: {analytics?.completedTasks || 2}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Overview & Activity Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects Table Matrix */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-white tracking-wide">Active Projects Status</h2>
            <Link href="/projects" className="text-xs text-cyan-400 hover:underline font-bold flex items-center gap-1">
              <span>View All Projects</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {projects.map((proj) => (
              <div key={proj.id} className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white hover:text-cyan-300 transition-colors">
                      {proj.title}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-[10px] font-bold text-slate-300 border border-slate-800">
                      {proj.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{proj.description}</p>
                </div>

                {/* Progress Bar & Status */}
                <div className="w-full sm:w-48 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-cyan-400">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-500 shadow-glow-cyan"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live System Audit Stream */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="font-extrabold text-base text-white tracking-wide">Live Audit Feed</h2>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Real-time
            </span>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-xs space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span className="font-bold text-cyan-400">{act.userName || 'Team Member'}</span>
                  <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-slate-300 text-xs leading-snug">{act.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
