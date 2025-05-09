
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo?: User;
  projectId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdBy: User;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  members: User[];
  tasks: Task[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
