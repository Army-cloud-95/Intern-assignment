'use client';

import { useState, useEffect } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import TaskModal from '@/components/TaskModal';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Layers, 
  User, 
  Flame,
  Kanban,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'timeline' | 'calendar'

  const [filterProject, setFilterProject] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resT, resP, resM] = await Promise.all([
        fetch('/api/tasks').then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/members').then((r) => r.json()),
      ]);
      setTasks(Array.isArray(resT) ? resT : []);
      setProjects(Array.isArray(resP) ? resP : []);
      setMembers(Array.isArray(resM) ? resM : []);
    } catch (err) {
      console.error('Tasks page fetch error:', err);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData();
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      const method = taskData.id ? 'PUT' : 'POST';
      const url = taskData.id ? `/api/tasks/${taskData.id}` : '/api/tasks';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (res.ok) {
        setIsTaskModalOpen(false);
        setSelectedTask(null);
        fetchData();
      }
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (res.ok) {
        setIsTaskModalOpen(false);
        setSelectedTask(null);
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleAddTaskClick = (columnId) => {
    setSelectedTask({ status: columnId });
    setIsTaskModalOpen(true);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesProject = filterProject === 'all' || t.projectId === filterProject;
    const matchesAssignee = filterAssignee === 'all' || t.assigneeId === filterAssignee;
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesAssignee && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-sky-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">Tasks Workspace</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage engineering deliverables via Kanban board, Gantt roadmap timeline, or monthly calendar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-sky-500 text-white shadow-glow-cyan' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'timeline' ? 'bg-indigo-600 text-white shadow-glow-purple' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline (Gantt)</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar' ? 'bg-emerald-600 text-white shadow-glow-emerald' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <button
            onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-cyan transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="all">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="all">All Assignees</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search task title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Main View Renderer */}
      {viewMode === 'kanban' && (
        <KanbanBoard
          tasks={filteredTasks}
          members={members}
          onUpdateStatus={handleUpdateStatus}
          onSelectTask={(task) => { setSelectedTask(task); setIsTaskModalOpen(true); }}
          onAddTaskClick={handleAddTaskClick}
        />
      )}

      {viewMode === 'timeline' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-bold text-sm text-white">Gantt Sprint Roadmap & Deadlines</h2>
            <span className="text-xs text-slate-400">September 2026 Timeline</span>
          </div>

          <div className="space-y-3">
            {filteredTasks.map((t) => {
              const assignee = members.find((m) => m.id === t.assigneeId);
              const isDone = t.status === 'done';

              return (
                <div key={t.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isDone ? 'bg-emerald-400' : 'bg-sky-400'}`} />
                      <h4 className="font-semibold text-xs text-white">{t.title}</h4>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 capitalize">{t.priority}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Due: {t.dueDate || '2026-09-15'}</span>
                    {assignee && (
                      <div className="flex items-center gap-1.5">
                        <img src={assignee.avatar} alt={assignee.name} className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-slate-300">{assignee.name.split(' ')[0]}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-bold text-sm text-white">September 2026 Monthly Calendar</h2>
            <span className="text-xs text-sky-400 font-semibold">{filteredTasks.length} Scheduled Tasks</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const dayTasks = filteredTasks.filter((t) => t.dueDate === dateStr);

              return (
                <div key={i} className="min-h-[90px] p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-400">{dayNum}</span>
                  <div className="space-y-1">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => { setSelectedTask(t); setIsTaskModalOpen(true); }}
                        className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[9px] font-medium truncate cursor-pointer hover:bg-sky-500/30"
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        task={selectedTask}
        projects={projects}
        members={members}
        onClose={() => { setIsTaskModalOpen(false); setSelectedTask(null); }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
