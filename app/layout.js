'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import TaskModal from '@/components/TaskModal';
import ProjectModal from '@/components/ProjectModal';
import MemberModal from '@/components/MemberModal';
import AiCopilotDrawer from '@/components/AiCopilotDrawer';
import './globals.css';

export default function RootLayout({ children }) {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [resP, resM, resT] = await Promise.all([
        fetch('/api/projects').then((res) => res.json()),
        fetch('/api/members').then((res) => res.json()),
        fetch('/api/tasks').then((res) => res.json()),
      ]);
      setProjects(Array.isArray(resP) ? resP : []);
      setMembers(Array.isArray(resM) ? resM : []);
      setTasks(Array.isArray(resT) ? resT : []);
    } catch (err) {
      console.error('Error fetching global initial data:', err);
    }
  };

  const handleResetData = async () => {
    if (window.confirm("Reset all project, task, and team data back to initial seed data?")) {
      try {
        const res = await fetch('/api/reset', { method: 'POST' });
        if (res.ok) {
          fetchInitialData();
          window.location.reload();
        }
      } catch (err) {
        console.error("Error resetting data:", err);
      }
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
        fetchInitialData();
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
        fetchInitialData();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
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
        setIsProjectModalOpen(false);
        setSelectedProject(null);
        fetchInitialData();
      }
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (res.ok) {
        setIsProjectModalOpen(false);
        setSelectedProject(null);
        fetchInitialData();
      }
    } catch (err) {
      console.error('Error deleting project:', err);
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
        fetchInitialData();
      }
    } catch (err) {
      console.error('Error saving member:', err);
    }
  };

  return (
    <html lang="en" className="dark">
      <head>
        <title>NOVA — Team Productivity Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Plan. Collaborate. Deliver. Next-generation project and task management for modern engineering teams." />
      </head>
      <body className="bg-[#030712] text-slate-100 antialiased min-h-screen">
        <div className="flex flex-col min-h-screen">
          {/* Responsive Sidebar */}
          <Sidebar
            mobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />

          {/* Header */}
          <Header
            onOpenTaskModal={() => { setSelectedTask(null); setIsTaskModalOpen(true); }}
            onOpenProjectModal={() => { setSelectedProject(null); setIsProjectModalOpen(true); }}
            onOpenMemberModal={() => setIsMemberModalOpen(true)}
            onToggleAiCopilot={() => setIsAiCopilotOpen(!isAiCopilotOpen)}
            onResetData={handleResetData}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          />

          {/* Main Content Area */}
          <main className="lg:ml-64 p-4 sm:p-6 flex-1 min-h-[calc(100vh-64px)] w-full max-w-full">
            {children}
          </main>
        </div>

        {/* Shared Modals */}
        <TaskModal
          isOpen={isTaskModalOpen}
          task={selectedTask}
          projects={projects}
          members={members}
          onClose={() => { setIsTaskModalOpen(false); setSelectedTask(null); }}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />

        <ProjectModal
          isOpen={isProjectModalOpen}
          project={selectedProject}
          members={members}
          onClose={() => { setIsProjectModalOpen(false); setSelectedProject(null); }}
          onSave={handleSaveProject}
          onDelete={handleDeleteProject}
        />

        <MemberModal
          isOpen={isMemberModalOpen}
          onClose={() => setIsMemberModalOpen(false)}
          onSave={handleSaveMember}
        />

        <AiCopilotDrawer
          isOpen={isAiCopilotOpen}
          onClose={() => setIsAiCopilotOpen(false)}
          onTasksGenerated={fetchInitialData}
        />
      </body>
    </html>
  );
}
