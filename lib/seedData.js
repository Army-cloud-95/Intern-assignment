export const initialMembers = [
  {
    id: "mem-1",
    name: "Alex Vance",
    email: "alex@nova.dev",
    role: "Admin & Lead Architect",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "active",
    activeTaskCount: 3,
    completedTaskCount: 14
  },
  {
    id: "mem-2",
    name: "Sarah Jenkins",
    email: "sarah@nova.dev",
    role: "Senior Product Manager",
    department: "Product",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "active",
    activeTaskCount: 4,
    completedTaskCount: 22
  },
  {
    id: "mem-3",
    name: "Devon Chen",
    email: "devon@nova.dev",
    role: "Full Stack Engineer",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "active",
    activeTaskCount: 5,
    completedTaskCount: 18
  },
  {
    id: "mem-4",
    name: "Elena Rostova",
    email: "elena@nova.dev",
    role: "Lead UI/UX Designer",
    department: "Design",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    status: "active",
    activeTaskCount: 2,
    completedTaskCount: 9
  },
  {
    id: "mem-5",
    name: "Marcus Thorne",
    email: "marcus@nova.dev",
    role: "DevOps & Cloud Specialist",
    department: "Infrastructure",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    status: "away",
    activeTaskCount: 2,
    completedTaskCount: 11
  }
];

export const initialProjects = [
  {
    id: "proj-1",
    title: "Nova 2.0 Core Infrastructure",
    description: "Architecting high-throughput REST & WebSocket APIs with microservice event streaming.",
    category: "Engineering",
    status: "active",
    priority: "urgent",
    progress: 68,
    startDate: "2026-08-01",
    dueDate: "2026-09-30",
    budgetHours: 240,
    leadId: "mem-1",
    memberIds: ["mem-1", "mem-3", "mem-5"],
    tags: ["API", "Backend", "Performance"],
    createdAt: "2026-08-01T10:00:00Z"
  },
  {
    id: "proj-2",
    title: "Mobile App Redesign & Design System",
    description: "Crafting a unified Dark Glassmorphism design system for iOS & Android native apps.",
    category: "Design",
    status: "active",
    priority: "high",
    progress: 82,
    startDate: "2026-08-10",
    dueDate: "2026-09-20",
    budgetHours: 160,
    leadId: "mem-4",
    memberIds: ["mem-2", "mem-4"],
    tags: ["UI/UX", "Design System", "Figma"],
    createdAt: "2026-08-10T11:30:00Z"
  },
  {
    id: "proj-3",
    title: "Enterprise AI Workflow Integrations",
    description: "Integrating LLM smart suggestions into automated task assignment and project risk analysis.",
    category: "Product",
    status: "planning",
    priority: "medium",
    progress: 25,
    startDate: "2026-09-01",
    dueDate: "2026-11-15",
    budgetHours: 320,
    leadId: "mem-2",
    memberIds: ["mem-1", "mem-2", "mem-3"],
    tags: ["AI", "Automation", "Productivity"],
    createdAt: "2026-09-01T09:00:00Z"
  },
  {
    id: "proj-4",
    title: "SOC-2 Security Audit & Compliance",
    description: "Harden database access controls, zero-trust secrets management, and audit logging.",
    category: "Infrastructure",
    status: "in_review",
    priority: "high",
    progress: 90,
    startDate: "2026-07-15",
    dueDate: "2026-09-12",
    budgetHours: 120,
    leadId: "mem-5",
    memberIds: ["mem-1", "mem-5"],
    tags: ["Security", "Compliance", "Audit"],
    createdAt: "2026-07-15T08:00:00Z"
  }
];

export const initialTasks = [
  {
    id: "task-101",
    projectId: "proj-1",
    title: "Implement JWT & Refresh Token Auth API",
    description: "Setup JWT secret rotation, secure httpOnly cookie parsing, and rate limiting middleware.",
    status: "done",
    priority: "high",
    assigneeId: "mem-1",
    dueDate: "2026-09-05",
    subtasks: [
      { id: "sub-1", text: "Write auth route handlers", completed: true },
      { id: "sub-2", text: "Add bearer token validation", completed: true },
      { id: "sub-3", text: "Unit test edge cases", completed: true }
    ],
    comments: [
      { id: "c-1", userId: "mem-2", userName: "Sarah Jenkins", text: "Tested token refresh flow, works smooth!", createdAt: "2026-09-04T16:20:00Z" }
    ],
    createdAt: "2026-08-15T09:00:00Z"
  },
  {
    id: "task-102",
    projectId: "proj-1",
    title: "Optimize Database Query Indexing & Caching",
    description: "Benchmark query latency on tasks & analytics aggregations. Add Redis/In-memory cache layer.",
    status: "in_progress",
    priority: "urgent",
    assigneeId: "mem-3",
    dueDate: "2026-09-10",
    subtasks: [
      { id: "sub-1", text: "Profile slow queries", completed: true },
      { id: "sub-2", text: "Create compound indexes on projectId + status", completed: true },
      { id: "sub-3", text: "Integrate cache invalidation strategy", completed: false }
    ],
    comments: [
      { id: "c-2", userId: "mem-1", userName: "Alex Vance", text: "Let's ensure cache TTL is under 30 seconds for live board moves.", createdAt: "2026-09-06T11:00:00Z" }
    ],
    createdAt: "2026-08-20T14:30:00Z"
  },
  {
    id: "task-103",
    projectId: "proj-1",
    title: "Real-time Activity Stream WebSockets",
    description: "Broadcast task move events to all connected project collaborators in real-time.",
    status: "review",
    priority: "high",
    assigneeId: "mem-3",
    dueDate: "2026-09-12",
    subtasks: [
      { id: "sub-1", text: "Setup WS event gateway", completed: true },
      { id: "sub-2", text: "Connect frontend client listener", completed: true }
    ],
    comments: [],
    createdAt: "2026-08-22T10:15:00Z"
  },
  {
    id: "task-104",
    projectId: "proj-2",
    title: "Design System Dark Palette & Component Library",
    description: "Build atomic React components with dynamic Tailwind CSS variables and micro-animations.",
    status: "done",
    priority: "high",
    assigneeId: "mem-4",
    dueDate: "2026-09-02",
    subtasks: [
      { id: "sub-1", text: "Button & Badge specs", completed: true },
      { id: "sub-2", text: "Modal & Drawer specs", completed: true },
      { id: "sub-3", text: "Figma UI Token export", completed: true }
    ],
    comments: [
      { id: "c-3", userId: "mem-2", userName: "Sarah Jenkins", text: "The glassmorphism cards look ultra sleek!", createdAt: "2026-09-02T14:00:00Z" }
    ],
    createdAt: "2026-08-12T11:00:00Z"
  },
  {
    id: "task-105",
    projectId: "proj-2",
    title: "Interactive Kanban Board Drag & Drop",
    description: "Support fluid drag-and-drop card movements across columns with visual target highlighting.",
    status: "in_progress",
    priority: "medium",
    assigneeId: "mem-4",
    dueDate: "2026-09-09",
    subtasks: [
      { id: "sub-1", text: "Column drop zone styling", completed: true },
      { id: "sub-2", text: "Optimistic UI status updates", completed: false }
    ],
    comments: [],
    createdAt: "2026-08-25T15:00:00Z"
  },
  {
    id: "task-106",
    projectId: "proj-3",
    title: "Prompt Engineering for Task Auto-Summaries",
    description: "Test Gemini API prompts to generate weekly status summaries from task logs.",
    status: "todo",
    priority: "medium",
    assigneeId: "mem-2",
    dueDate: "2026-09-18",
    subtasks: [
      { id: "sub-1", text: "Draft structured output schema", completed: false },
      { id: "sub-2", text: "Benchmark response latency", completed: false }
    ],
    comments: [],
    createdAt: "2026-09-01T16:00:00Z"
  },
  {
    id: "task-107",
    projectId: "proj-4",
    title: "Secrets Encryption at Rest & Rotation Policy",
    description: "Encrypt database credentials and secrets using KMS envelope encryption.",
    status: "todo",
    priority: "high",
    assigneeId: "mem-5",
    dueDate: "2026-09-14",
    subtasks: [
      { id: "sub-1", text: "KMS setup script", completed: false }
    ],
    comments: [],
    createdAt: "2026-09-03T10:00:00Z"
  }
];

export const initialActivities = [
  {
    id: "act-1",
    type: "task_complete",
    title: "Task Completed",
    description: "Elena Rostova marked 'Design System Dark Palette' as Done.",
    userId: "mem-4",
    userName: "Elena Rostova",
    projectId: "proj-2",
    timestamp: "2026-09-06T14:30:00Z"
  },
  {
    id: "act-2",
    type: "task_move",
    title: "Kanban Board Updated",
    description: "Devon Chen moved 'Real-time Activity Stream' to Review.",
    userId: "mem-3",
    userName: "Devon Chen",
    projectId: "proj-1",
    timestamp: "2026-09-06T11:15:00Z"
  },
  {
    id: "act-3",
    type: "project_create",
    title: "New Project Initiated",
    description: "Sarah Jenkins created project 'Enterprise AI Workflow Integrations'.",
    userId: "mem-2",
    userName: "Sarah Jenkins",
    projectId: "proj-3",
    timestamp: "2026-09-01T09:00:00Z"
  }
];
