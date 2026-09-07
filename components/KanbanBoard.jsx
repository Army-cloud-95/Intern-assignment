'use client';

import { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MoreHorizontal, 
  Plus, 
  MessageSquare, 
  ListTodo, 
  User, 
  Flame,
  Layers,
  Sparkles
} from 'lucide-react';

export default function KanbanBoard({ tasks, members, onUpdateStatus, onSelectTask, onAddTaskClick }) {
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [activeMobileCol, setActiveMobileCol] = useState('all');

  const columns = [
    { 
      id: 'todo', 
      title: 'To Do', 
      dotColor: 'bg-cyan-400 shadow-glow-cyan', 
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      headerBorder: 'border-t-cyan-500'
    },
    { 
      id: 'in_progress', 
      title: 'In Progress', 
      dotColor: 'bg-indigo-400 shadow-glow-purple', 
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      headerBorder: 'border-t-indigo-500'
    },
    { 
      id: 'review', 
      title: 'In Review', 
      dotColor: 'bg-purple-400 shadow-glow-purple', 
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      headerBorder: 'border-t-purple-500'
    },
    { 
      id: 'done', 
      title: 'Completed', 
      dotColor: 'bg-emerald-400 shadow-glow-emerald', 
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      headerBorder: 'border-t-emerald-500'
    },
  ];

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/40 flex items-center gap-1"><Flame className="w-3 h-3 text-rose-400 animate-pulse" /> Urgent</span>;
      case 'high':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/40">High</span>;
      case 'medium':
        return <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold border border-cyan-500/40">Medium</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium border border-slate-700">Low</span>;
    }
  };

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      onUpdateStatus(taskId, columnId);
      setDraggedTaskId(null);
    }
  };

  const visibleColumns = columns.filter(col => activeMobileCol === 'all' || col.id === activeMobileCol);

  return (
    <div className="space-y-4">
      {/* Mobile Column Quick Filter Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:hidden no-scrollbar">
        <button
          onClick={() => setActiveMobileCol('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeMobileCol === 'all' ? 'bg-cyan-500 text-white shadow-glow-cyan' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          All Columns
        </button>
        {columns.map(col => (
          <button
            key={col.id}
            onClick={() => setActiveMobileCol(col.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeMobileCol === col.id ? 'bg-cyan-500 text-white shadow-glow-cyan' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            {col.title} ({tasks.filter(t => t.status === col.id).length})
          </button>
        ))}
      </div>

      {/* Grid Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {visibleColumns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`glass-panel rounded-2xl p-4 border border-slate-800/80 ${col.headerBorder} border-t-2 flex flex-col min-h-[400px] lg:h-[calc(100vh-200px)] lg:min-h-[520px] transition-all duration-300 bg-slate-950/60`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">{col.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold border ${col.badgeBg}`}>
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => onAddTaskClick(col.id)}
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white"
                  title="Add task to column"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Column Task Cards */}
              <div className="space-y-3.5 overflow-y-auto flex-1 pr-1">
                {colTasks.length === 0 ? (
                  <div className="border border-dashed border-slate-800/80 rounded-2xl p-6 text-center text-slate-500 text-xs my-3 bg-slate-950/30">
                    <p className="font-medium">No tasks in {col.title}</p>
                    <button
                      onClick={() => onAddTaskClick(col.id)}
                      className="mt-2 text-cyan-400 hover:underline text-[11px] font-bold inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Create task</span>
                    </button>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const assignee = members.find((m) => m.id === task.assigneeId);
                    const subtasksDone = (task.subtasks || []).filter((s) => s.completed).length;
                    const totalSubtasks = (task.subtasks || []).length;
                    const subtaskProgress = totalSubtasks > 0 ? Math.round((subtasksDone / totalSubtasks) * 100) : 0;

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => onSelectTask(task)}
                        className="glass-card rounded-2xl p-4 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer group relative bg-slate-900/80 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          {getPriorityBadge(task.priority)}

                          <select
                            value={task.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              onUpdateStatus(task.id, e.target.value);
                            }}
                            className="bg-slate-950/90 text-slate-300 border border-slate-800 rounded-lg text-[10px] px-2 py-1 focus:outline-none hover:border-slate-700 font-semibold"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">In Review</option>
                            <option value="done">Completed</option>
                          </select>
                        </div>

                        <h4 className="font-bold text-xs text-white leading-snug group-hover:text-cyan-300 transition-colors">
                          {task.title}
                        </h4>

                        {totalSubtasks > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                              <span className="flex items-center gap-1 text-slate-400">
                                <ListTodo className="w-3 h-3 text-cyan-400" />
                                Subtasks ({subtasksDone}/{totalSubtasks})
                              </span>
                              <span className="text-cyan-400">{subtaskProgress}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-300 shadow-glow-cyan"
                                style={{ width: `${subtaskProgress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                          <div className="flex items-center gap-3">
                            {(task.comments || []).length > 0 && (
                              <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                                <MessageSquare className="w-3 h-3 text-indigo-400" />
                                {task.comments.length}
                              </span>
                            )}
                          </div>

                          {assignee && (
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-6 h-6 rounded-full ring-2 ring-cyan-500/40 object-cover"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
