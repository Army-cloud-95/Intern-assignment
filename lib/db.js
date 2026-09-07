import fs from 'fs';
import path from 'path';
import { initialProjects, initialTasks, initialMembers, initialActivities } from './seedData.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

let memoryStore = null;

function ensureDataStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_PATH)) {
      const defaultData = getFreshSeedData();
      fs.writeFileSync(STORE_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const content = fs.readFileSync(STORE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error("DB File Sync Error, using memoryStore:", err);
    if (!memoryStore) {
      memoryStore = getFreshSeedData();
    }
    return memoryStore;
  }
}

function getFreshSeedData() {
  // Enhanced seed data with milestones, attachments, logged hours
  const projects = initialProjects.map((p, idx) => ({
    ...p,
    budgetSpent: Math.round((p.budgetHours || 100) * (p.progress / 100) * 85),
    milestones: [
      { id: `m-${p.id}-1`, title: 'Architecture & Initial Specs', dueDate: p.startDate, status: 'completed' },
      { id: `m-${p.id}-2`, title: 'Core Beta Implementation', dueDate: '2026-09-15', status: p.progress > 50 ? 'completed' : 'in_progress' },
      { id: `m-${p.id}-3`, title: 'Production Release & Audit', dueDate: p.dueDate, status: 'pending' },
    ]
  }));

  const tasks = initialTasks.map((t, idx) => ({
    ...t,
    estimatedHours: (idx + 1) * 8,
    loggedHours: t.status === 'done' ? (idx + 1) * 8 : (idx + 1) * 4,
    attachments: [
      { id: `att-${idx}-1`, name: 'API_Architecture_Diagram.png', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80', type: 'image', size: '1.4 MB' },
      { id: `att-${idx}-2`, name: 'Technical_Requirements.pdf', url: '#', type: 'document', size: '420 KB' }
    ]
  }));

  return {
    projects,
    tasks,
    members: initialMembers,
    activities: initialActivities,
    activeUser: initialMembers[0] // Alex Vance Admin
  };
}

function saveStore(data) {
  try {
    if (fs.existsSync(DATA_DIR)) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } else {
      memoryStore = data;
    }
  } catch (err) {
    console.error("Save Store Error:", err);
    memoryStore = data;
  }
}

export function getStore() {
  return ensureDataStore();
}

export function resetToSeedData() {
  const freshData = getFreshSeedData();
  saveStore(freshData);
  return freshData;
}

// ACTIVE USER / ROLE SWITCHER
export function getActiveUser() {
  const store = getStore();
  return store.activeUser || store.members[0];
}

export function setActiveUser(memberId) {
  const store = getStore();
  const user = store.members.find(m => m.id === memberId);
  if (user) {
    store.activeUser = user;
    saveStore(store);
  }
  return store.activeUser;
}

// PROJECTS
export function getProjects() {
  const store = getStore();
  return store.projects;
}

export function getProjectById(id) {
  const store = getStore();
  return store.projects.find(p => p.id === id);
}

export function createProject(projectData) {
  const store = getStore();
  const newProject = {
    id: `proj-${Date.now()}`,
    progress: 0,
    status: 'planning',
    createdAt: new Date().toISOString(),
    memberIds: projectData.memberIds || [],
    tags: projectData.tags || [],
    budgetSpent: 0,
    milestones: [
      { id: `m-${Date.now()}-1`, title: 'Kickoff & Requirements', dueDate: projectData.startDate || new Date().toISOString().split('T')[0], status: 'in_progress' },
      { id: `m-${Date.now()}-2`, title: 'Final Delivery & Launch', dueDate: projectData.dueDate || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0], status: 'pending' }
    ],
    ...projectData,
  };
  store.projects.unshift(newProject);
  
  store.activities.unshift({
    id: `act-${Date.now()}`,
    type: 'project_create',
    title: 'New Project Launched',
    description: `${store.activeUser?.name || 'User'} created project '${newProject.title}'.`,
    userId: store.activeUser?.id || 'mem-1',
    userName: store.activeUser?.name || 'Alex Vance',
    projectId: newProject.id,
    timestamp: new Date().toISOString()
  });

  saveStore(store);
  return newProject;
}

export function updateProject(id, updateData) {
  const store = getStore();
  const index = store.projects.findIndex(p => p.id === id);
  if (index === -1) return null;

  store.projects[index] = { ...store.projects[index], ...updateData };
  saveStore(store);
  return store.projects[index];
}

export function deleteProject(id) {
  const store = getStore();
  store.projects = store.projects.filter(p => p.id !== id);
  store.tasks = store.tasks.filter(t => t.projectId !== id);
  saveStore(store);
  return true;
}

// TASKS
export function getTasks(filters = {}) {
  const store = getStore();
  let tasks = store.tasks;
  if (filters.projectId) {
    tasks = tasks.filter(t => t.projectId === filters.projectId);
  }
  if (filters.assigneeId) {
    tasks = tasks.filter(t => t.assigneeId === filters.assigneeId);
  }
  if (filters.status) {
    tasks = tasks.filter(t => t.status === filters.status);
  }
  if (filters.priority) {
    tasks = tasks.filter(t => t.priority === filters.priority);
  }
  return tasks;
}

export function getTaskById(id) {
  const store = getStore();
  return store.tasks.find(t => t.id === id);
}

export function createTask(taskData) {
  const store = getStore();
  const newTask = {
    id: `task-${Date.now()}`,
    status: 'todo',
    priority: 'medium',
    subtasks: [],
    comments: [],
    attachments: [],
    estimatedHours: 8,
    loggedHours: 0,
    createdAt: new Date().toISOString(),
    ...taskData,
  };
  store.tasks.unshift(newTask);

  recalculateProjectProgress(newTask.projectId, store);

  store.activities.unshift({
    id: `act-${Date.now()}`,
    type: 'task_create',
    title: 'Task Created',
    description: `${store.activeUser?.name || 'User'} created task '${newTask.title}'.`,
    userId: store.activeUser?.id || 'mem-1',
    userName: store.activeUser?.name || 'Alex Vance',
    projectId: newTask.projectId,
    timestamp: new Date().toISOString()
  });

  saveStore(store);
  return newTask;
}

export function updateTask(id, updateData) {
  const store = getStore();
  const index = store.tasks.findIndex(t => t.id === id);
  if (index === -1) return null;

  const oldStatus = store.tasks[index].status;
  store.tasks[index] = { ...store.tasks[index], ...updateData };
  const updatedTask = store.tasks[index];

  if (updateData.status && updateData.status !== oldStatus) {
    recalculateProjectProgress(updatedTask.projectId, store);
    store.activities.unshift({
      id: `act-${Date.now()}`,
      type: 'task_move',
      title: 'Task Status Updated',
      description: `${store.activeUser?.name || 'User'} moved '${updatedTask.title}' to ${updatedTask.status.replace('_', ' ').toUpperCase()}.`,
      userId: store.activeUser?.id || 'mem-1',
      userName: store.activeUser?.name || 'Alex Vance',
      projectId: updatedTask.projectId,
      timestamp: new Date().toISOString()
    });
  }

  saveStore(store);
  return updatedTask;
}

export function deleteTask(id) {
  const store = getStore();
  const task = store.tasks.find(t => t.id === id);
  if (!task) return false;

  const projectId = task.projectId;
  store.tasks = store.tasks.filter(t => t.id !== id);
  recalculateProjectProgress(projectId, store);
  saveStore(store);
  return true;
}

function recalculateProjectProgress(projectId, store) {
  const projectTasks = store.tasks.filter(t => t.projectId === projectId);
  if (projectTasks.length === 0) return;
  const completedCount = projectTasks.filter(t => t.status === 'done').length;
  const progressPercent = Math.round((completedCount / projectTasks.length) * 100);
  
  const projIndex = store.projects.findIndex(p => p.id === projectId);
  if (projIndex !== -1) {
    store.projects[projIndex].progress = progressPercent;
  }
}

// MEMBERS
export function getMembers() {
  const store = getStore();
  return store.members;
}

export function createMember(memberData) {
  const store = getStore();
  const newMember = {
    id: `mem-${Date.now()}`,
    status: 'active',
    activeTaskCount: 0,
    completedTaskCount: 0,
    avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    ...memberData
  };
  store.members.push(newMember);
  saveStore(store);
  return newMember;
}

// ACTIVITIES
export function getActivities(limit = 25) {
  const store = getStore();
  return store.activities.slice(0, limit);
}

// AI COPILOT HELPER
export function generateAiSuggestions(promptType, contextData = {}) {
  const store = getStore();

  if (promptType === 'task_breakdown') {
    return {
      suggestedTasks: [
        { title: 'Write Technical Design Spec & DB Schema', estimatedHours: 6, priority: 'high', assigneeId: 'mem-1' },
        { title: 'Setup CI/CD Pipeline & Automated Tests', estimatedHours: 8, priority: 'urgent', assigneeId: 'mem-5' },
        { title: 'Build Frontend UI Components & Micro-animations', estimatedHours: 12, priority: 'high', assigneeId: 'mem-4' },
        { title: 'Conduct E2E Testing & Security Audit', estimatedHours: 6, priority: 'medium', assigneeId: 'mem-3' },
      ],
      aiSummary: 'Based on your project goals, NOVA AI generated a 4-phase engineering task roadmap optimized for high throughput.'
    };
  }

  if (promptType === 'workload_optimization') {
    const overloadedMember = store.members.find(m => {
      const active = store.tasks.filter(t => t.assigneeId === m.id && t.status !== 'done').length;
      return active >= 4;
    });

    const availableMember = store.members.find(m => {
      const active = store.tasks.filter(t => t.assigneeId === m.id && t.status !== 'done').length;
      return active < 2;
    });

    return {
      recommendation: overloadedMember && availableMember
        ? `Reassign 2 tasks from ${overloadedMember.name} (${overloadedMember.role}) to ${availableMember.name} (${availableMember.role}) to reduce team burnout by 35%.`
        : 'Team workload is currently balanced across all active sprints.',
      healthScore: 94
    };
  }

  return {
    recommendation: 'All systems operational. Overall project completion velocity is +18% ahead of target deadline.'
  };
}

// ANALYTICS
export function getAnalyticsSummary() {
  const store = getStore();
  const totalProjects = store.projects.length;
  const totalTasks = store.tasks.length;
  const completedTasks = store.tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = store.tasks.filter(t => t.status === 'in_progress').length;
  const reviewTasks = store.tasks.filter(t => t.status === 'review').length;
  const todoTasks = store.tasks.filter(t => t.status === 'todo').length;

  const totalLoggedHours = store.tasks.reduce((sum, t) => sum + (t.loggedHours || 0), 0);
  const totalEstimatedHours = store.tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const memberWorkload = store.members.map(m => {
    const mTasks = store.tasks.filter(t => t.assigneeId === m.id);
    return {
      name: m.name,
      active: mTasks.filter(t => t.status !== 'done').length,
      completed: mTasks.filter(t => t.status === 'done').length
    };
  });

  return {
    totalProjects,
    totalTasks,
    completedTasks,
    inProgressTasks,
    reviewTasks,
    todoTasks,
    completionRate,
    totalLoggedHours,
    totalEstimatedHours,
    memberWorkload,
    statusBreakdown: [
      { name: 'To Do', value: todoTasks, color: '#94a3b8' },
      { name: 'In Progress', value: inProgressTasks, color: '#38bdf8' },
      { name: 'In Review', value: reviewTasks, color: '#818cf8' },
      { name: 'Completed', value: completedTasks, color: '#10b981' }
    ]
  };
}
