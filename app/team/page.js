'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Flame, 
  Search 
} from 'lucide-react';
import MemberModal from '@/components/MemberModal';

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const [resM, resT] = await Promise.all([
        fetch('/api/members').then((r) => r.json()),
        fetch('/api/tasks').then((r) => r.json()),
      ]);
      setMembers(Array.isArray(resM) ? resM : []);
      setTasks(Array.isArray(resT) ? resT : []);
    } catch (err) {
      console.error('Error fetching team data:', err);
    }
  };

  const handleSaveMember = async (memberData) => {
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });
      if (res.ok) {
        setIsMemberModalOpen(false);
        fetchTeamData();
      }
    } catch (err) {
      console.error('Error adding member:', err);
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesDept = departmentFilter === 'all' || m.department === departmentFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const getWorkloadStatus = (activeCount) => {
    if (activeCount >= 4) {
      return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">Heavy Capacity</span>;
    } else if (activeCount >= 2) {
      return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">Moderate Load</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">Available</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">Team & Workload Directory</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitor collaborator active task loads, roles, and departmental capacity.
          </p>
        </div>

        <button
          onClick={() => setIsMemberModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-bold shadow-glow-purple transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['all', 'Engineering', 'Product', 'Design', 'Infrastructure'].map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                departmentFilter === dept
                  ? 'bg-indigo-600 text-white shadow-glow-purple'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search member name, email, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Members Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
          const activeTasks = memberTasks.filter((t) => t.status !== 'done');
          const completedTasks = memberTasks.filter((t) => t.status === 'done');

          return (
            <div
              key={member.id}
              className="glass-card rounded-2xl p-5 border space-y-4 hover:border-indigo-500/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white">{member.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">{member.role}</p>
                    <span className="inline-block text-[10px] text-indigo-400 font-semibold mt-0.5">
                      {member.department}
                    </span>
                  </div>
                </div>

                {getWorkloadStatus(activeTasks.length)}
              </div>

              {/* Email & Contact */}
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{member.email}</span>
              </div>

              {/* Task Load Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-center">
                <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800">
                  <span className="block text-lg font-extrabold text-sky-400">{activeTasks.length}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Tasks</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800">
                  <span className="block text-lg font-extrabold text-emerald-400">{completedTasks.length}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Completed</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Modal */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSave={handleSaveMember}
      />
    </div>
  );
}
