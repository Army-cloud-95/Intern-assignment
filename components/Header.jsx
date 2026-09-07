'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  FolderPlus, 
  UserCheck, 
  Sparkles, 
  RotateCcw, 
  User, 
  ChevronDown,
  CheckCircle2,
  X
} from 'lucide-react';

export default function Header({ 
  onOpenTaskModal, 
  onOpenProjectModal, 
  onOpenMemberModal, 
  onToggleAiCopilot,
  onResetData 
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchActiveUserAndMembers();
  }, []);

  const fetchActiveUserAndMembers = async () => {
    try {
      const [resU, resM] = await Promise.all([
        fetch('/api/user').then(r => r.json()),
        fetch('/api/members').then(r => r.json())
      ]);
      setActiveUser(resU);
      setMembers(Array.isArray(resM) ? resM : []);
    } catch (err) {
      console.error("Header fetch error:", err);
    }
  };

  const handleSwitchUser = async (memberId) => {
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId })
      });
      if (res.ok) {
        const u = await res.json();
        setActiveUser(u);
        setShowRoleDropdown(false);
        window.location.reload(); // Refresh view state for new user role
      }
    } catch (err) {
      console.error("Error switching active user:", err);
    }
  };

  const notifications = [
    { id: 1, title: 'Task Completed', text: 'Elena completed Design System Dark Palette', time: '10m ago', unread: true },
    { id: 2, title: 'Status Changed', text: 'Devon moved Activity Stream to In Review', time: '45m ago', unread: true },
    { id: 3, title: 'New Member', text: 'Marcus Thorne joined NOVA Platform', time: '2h ago', unread: false },
  ];

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6 ml-64">
      {/* Search Input */}
      <div className="relative w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks, projects, tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5">
        {/* AI Copilot Button */}
        <button
          onClick={onToggleAiCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 text-white text-xs font-bold shadow-glow-purple transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 fill-white" />
          <span>AI Copilot</span>
        </button>

        {/* Quick Action Buttons */}
        <button
          onClick={onOpenTaskModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-cyan transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>

        <button
          onClick={onOpenProjectModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all active:scale-95"
        >
          <FolderPlus className="w-4 h-4 text-sky-400" />
          <span>Project</span>
        </button>

        {/* Reset Demo Data Button */}
        <button
          onClick={onResetData}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Reset Demo Seed Data"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-0.5" />

        {/* Role & Account Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-xs"
          >
            <img
              src={activeUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={activeUser?.name || "User"}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-sky-500/50"
            />
            <div className="text-left hidden md:block truncate max-w-[100px]">
              <span className="font-bold text-white block text-[11px] truncate">{activeUser?.name || 'Alex Vance'}</span>
              <span className="text-[9px] text-sky-400 block truncate">{activeUser?.role || 'Admin'}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl p-3 shadow-glass border border-slate-800 z-50 animate-in fade-in duration-150">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 mb-2">
                Evaluator Role Simulator
              </span>
              <div className="space-y-1">
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSwitchUser(m.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                      activeUser?.id === m.id ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                      <div className="truncate">
                        <span className="font-bold block truncate">{m.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{m.role}</span>
                      </div>
                    </div>
                    {activeUser?.id === m.id && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-sky-500 absolute top-1.5 right-1.5 ring-2 ring-[#090d16]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl p-4 shadow-glass border border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white">Notifications</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold">2 new</span>
                </div>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-2.5 rounded-xl border text-xs ${n.unread ? 'bg-slate-800/80 border-sky-500/30' : 'bg-slate-900/40 border-slate-800/50'}`}>
                    <div className="flex justify-between items-start mb-0.5">
                      <span className="font-semibold text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
