'use client';

import { useState, useEffect } from 'react';
import { VelocityChart, StatusPieChart, WorkloadBarChart } from '@/components/Charts';
import StatCard from '@/components/StatCard';
import { 
  BarChart3, 
  Download, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Users, 
  FileText,
  TrendingUp
} from 'lucide-react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics').then((r) => r.json());
      setAnalytics(res);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const handleExportJSON = () => {
    if (!analytics) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analytics, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nova-analytics-report-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">Analytics & Performance Reports</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Data insights, sprint velocity metrics, and resource allocation reports across all engineering teams.
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
        >
          <Download className="w-4 h-4 text-sky-400" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Task Completion"
          value={`${analytics?.completionRate || 68}%`}
          change="+14%"
          changeType="positive"
          icon={CheckCircle2}
          color="emerald"
          subtitle="Target completion > 65%"
        />
        <StatCard
          title="In Progress Tasks"
          value={analytics?.inProgressTasks || 2}
          change="On track"
          changeType="positive"
          icon={Clock}
          color="sky"
          subtitle="Average cycle time: 3.2 days"
        />
        <StatCard
          title="Total Active Projects"
          value={analytics?.totalProjects || 4}
          change="+1 new"
          changeType="positive"
          icon={TrendingUp}
          color="indigo"
          subtitle="100% health score"
        />
        <StatCard
          title="Team Velocity Index"
          value="42.8 pts"
          change="+8.5 pts"
          changeType="positive"
          icon={Zap}
          color="amber"
          subtitle="Sprint velocity up 18%"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Workload Distribution Bar Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div>
            <h2 className="font-bold text-sm text-white">Member Task Workload</h2>
            <p className="text-[11px] text-slate-400">Active vs Completed tasks by collaborator</p>
          </div>
          <WorkloadBarChart workload={analytics?.memberWorkload || []} />
        </div>

        {/* Task Status Breakdown Pie Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div>
            <h2 className="font-bold text-sm text-white">Status Breakdown</h2>
            <p className="text-[11px] text-slate-400">Proportional distribution across workflow stages</p>
          </div>
          <StatusPieChart breakdown={analytics?.statusBreakdown || []} />
        </div>
      </div>

      {/* Sprint Velocity Curve */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div>
          <h2 className="font-bold text-sm text-white">Historical Velocity Trend</h2>
          <p className="text-[11px] text-slate-400">Completed vs created tasks trend over recent sprints</p>
        </div>
        <VelocityChart />
      </div>
    </div>
  );
}
