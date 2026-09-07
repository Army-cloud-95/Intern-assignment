'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  CheckSquare, 
  Trash2, 
  Plus, 
  User, 
  Calendar, 
  AlertCircle, 
  MessageSquare, 
  Send,
  Flame,
  CheckCircle2,
  Clock,
  Paperclip,
  ExternalLink
} from 'lucide-react';

export default function TaskModal({ task, projects = [], members = [], isOpen, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: projects[0]?.id || 'proj-1',
    status: 'todo',
    priority: 'medium',
    assigneeId: members[0]?.id || 'mem-1',
    dueDate: '',
    estimatedHours: 8,
    loggedHours: 0,
    subtasks: [],
    comments: [],
    attachments: []
  });

  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title || '',
        description: task.description || '',
        projectId: task.projectId || projects[0]?.id || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        assigneeId: task.assigneeId || members[0]?.id || '',
        dueDate: task.dueDate || '',
        estimatedHours: task.estimatedHours || 8,
        loggedHours: task.loggedHours || 0,
        subtasks: task.subtasks || [],
        comments: task.comments || [],
        attachments: task.attachments || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        projectId: projects[0]?.id || '',
        status: 'todo',
        priority: 'medium',
        assigneeId: members[0]?.id || '',
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        estimatedHours: 8,
        loggedHours: 0,
        subtasks: [],
        comments: [],
        attachments: []
      });
    }
  }, [task, projects, members, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
  };

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    const updatedSubtasks = [
      ...formData.subtasks,
      { id: `sub-${Date.now()}`, text: newSubtaskText.trim(), completed: false }
    ];
    setFormData({ ...formData, subtasks: updatedSubtasks });
    setNewSubtaskText('');
  };

  const handleToggleSubtask = (subId) => {
    const updatedSubtasks = formData.subtasks.map((s) =>
      s.id === subId ? { ...s, completed: !s.completed } : s
    );
    setFormData({ ...formData, subtasks: updatedSubtasks });
  };

  const handleDeleteSubtask = (subId) => {
    const updatedSubtasks = formData.subtasks.filter((s) => s.id !== subId);
    setFormData({ ...formData, subtasks: updatedSubtasks });
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      userId: 'mem-1',
      userName: 'Alex Vance',
      text: newCommentText.trim(),
      createdAt: new Date().toISOString()
    };
    setFormData({ ...formData, comments: [...formData.comments, newComment] });
    setNewCommentText('');
  };

  const handleAddAttachment = () => {
    if (!newAttachmentName.trim()) return;
    const newAtt = {
      id: `att-${Date.now()}`,
      name: newAttachmentName.trim(),
      url: newAttachmentUrl.trim() || '#',
      size: '1.2 MB'
    };
    setFormData({ ...formData, attachments: [...formData.attachments, newAtt] });
    setNewAttachmentName('');
    setNewAttachmentUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">
              {task ? 'Edit Task Specs' : 'Create New Task'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {task && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Implement OAuth2 Refresh Token Rotation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Grid Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Project</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Assignee</label>
              <select
                value={formData.assigneeId}
                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Tracking Row */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Logged Hours</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.loggedHours}
                onChange={(e) => setFormData({ ...formData, loggedHours: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Est. Hours</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) || 1 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Add comprehensive technical specs or context for the task..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Subtasks Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">Subtask Checklist</label>
              <span className="text-[10px] text-slate-400">
                {formData.subtasks.filter(s => s.completed).length}/{formData.subtasks.length} completed
              </span>
            </div>

            <div className="space-y-1.5 mb-2">
              {formData.subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleSubtask(st.id)}
                    className="flex items-center gap-2 text-slate-200 text-left hover:text-white"
                  >
                    <CheckCircle2 className={`w-4 h-4 ${st.completed ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-600'}`} />
                    <span className={st.completed ? 'line-through text-slate-500' : ''}>{st.text}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask item..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Attachments Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Paperclip className="w-4 h-4 text-sky-400" />
              <span>Attachments & Reference Links</span>
            </label>

            <div className="space-y-1.5 mb-2">
              {formData.attachments.map((att) => (
                <div key={att.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-medium text-slate-200">{att.name}</span>
                    <span className="text-[10px] text-slate-500">({att.size || 'Link'})</span>
                  </div>
                  <a href={att.url} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-1 text-[11px]">
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Attachment name (e.g. Figma_Mockup.png)..."
                value={newAttachmentName}
                onChange={(e) => setNewAttachmentName(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="URL (optional)..."
                  value={newAttachmentUrl}
                  onChange={(e) => setNewAttachmentUrl(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                >
                  Attach
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          {task && (
            <div className="border-t border-slate-800 pt-4">
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Comments & Discussion ({formData.comments.length})</span>
              </label>

              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {formData.comments.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-sky-400">{c.userName}</span>
                      <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-300 leading-snug">{c.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddComment(); } }}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-cyan"
            >
              {task ? 'Save Task Specs' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
