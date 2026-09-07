'use client';

import { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Grid, 
  List, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  User, 
  Tag, 
  Trash2, 
  Edit3
} from 'lucide-react';
import ProjectModal from '@/components/ProjectModal';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resP, resM] = await Promise.all([
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/members').then((r) => r.json()),
      ]);
      setProjects(Array.isArray(resP) ? resP : []);
      setMembers(Array.isArray(resM) ? resM : []);
    } catch (err) {
      console.error('Projects page fetch error:', err);
    }
  };

  const handleSaveProject = async (projectData) => {
    try {
      const method = projectData.id ? 'PUT' : 'POST';
      const url = projectData.id ? `/api/projects/${projectData.id}` : '/api/projects';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setSelectedProject(null);
        fetchData();
      }
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (res.ok) {
        setIsModalOpen(false);
        setSelectedProject(null);
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold border border-sky-500/30">Active</span>;
      case 'planning':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">Planning</span>;
      case 'in_review':
        return <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/30">In Review</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">Completed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold border border-slate-700">On Hold</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-sky-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">Projects Directory</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage team projects, track deliverables, and allocate resources.</p>
        </div>

        <button
          onClick={() => { setSelectedProject(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-cyan transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['all', 'planning', 'active', 'in_review', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterStatus === st
                  ? 'bg-sky-500 text-white shadow-glow-cyan'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-slate-400 ${viewMode === 'grid' ? 'bg-slate-800 text-sky-400' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-slate-400 ${viewMode === 'list' ? 'bg-slate-800 text-sky-400' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const lead = members.find((m) => m.id === proj.leadId);

            return (
              <div
                key={proj.id}
                onClick={() => { setSelectedProject(proj); setIsModalOpen(true); }}
                className="glass-card rounded-2xl p-5 border flex flex-col justify-between hover:scale-[1.01] transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[11px] font-semibold border border-slate-800">
                      {proj.category}
                    </span>
                    {getStatusBadge(proj.status)}
                  </div>

                  <h3 className="font-bold text-base text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {proj.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(proj.tags || []).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-medium border border-slate-800/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress & Footer */}
                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-slate-400">Completion</span>
                      <span className="text-sky-400">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Due {proj.dueDate}</span>
                    </div>

                    {lead && (
                      <div className="flex items-center gap-1.5" title={`Lead: ${lead.name}`}>
                        <img src={lead.avatar} alt={lead.name} className="w-5 h-5 rounded-full object-cover ring-1 ring-sky-500/40" />
                        <span className="font-medium text-slate-300">{lead.name.split(' ')[0]}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 space-y-2">
            {filteredProjects.map((proj) => {
              const lead = members.find((m) => m.id === proj.leadId);
              return (
                <div
                  key={proj.id}
                  onClick={() => { setSelectedProject(proj); setIsModalOpen(true); }}
                  className="glass-card p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-sky-500/40 transition-all cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm text-white hover:text-sky-300">{proj.title}</h3>
                      {getStatusBadge(proj.status)}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{proj.description}</p>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-slate-400">
                    <div className="w-32">
                      <div className="flex justify-between text-[10px] font-semibold mb-1">
                        <span>Progress</span>
                        <span className="text-sky-400">{proj.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: `${proj.progress}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{proj.dueDate}</span>
                    </div>

                    {lead && (
                      <div className="flex items-center gap-1.5">
                        <img src={lead.avatar} alt={lead.name} className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-slate-300">{lead.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        project={selectedProject}
        members={members}
        onClose={() => { setIsModalOpen(false); setSelectedProject(null); }}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
      />
    </div>
  );
}
