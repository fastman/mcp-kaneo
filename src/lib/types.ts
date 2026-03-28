export type Priority = 'no-priority' | 'low' | 'medium' | 'high' | 'urgent';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  workspaceId: string;
  icon?: string;
}

export interface Column {
  id: string;
  name: string;
  slug: string;
  projectId: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: string;
  priority: Priority;
  dueDate?: string;
  userId?: string;
  position: number;
  number: number;
  createdAt: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  workspaceId: string;
  taskId?: string;
  createdAt: string;
}

export interface Comment {
  id?: string;
  taskId?: string;
  userId?: string;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentResult {
  command: string;
  rowCount: number;
  oid: number;
  rows: unknown[];
  fields: unknown[];
}

export interface SearchResult {
  results: unknown[];
  totalCount: number;
  searchQuery: string;
  tasks?: Task[];
  projects?: Project[];
  workspaces?: Workspace[];
  comments?: Comment[];
}

export interface TasksResponse {
  data: {
    id: string;
    name: string;
    slug: string;
    columns: {
      id: string;
      name: string;
      isFinal: boolean;
      tasks: Task[];
    }[];
  };
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface CreateTaskInput {
  title: string;
  description: string;
  priority: Priority;
  status: string;
  projectId: string;
}

export interface CreateLabelInput {
  name: string;
  color: string;
  workspaceId: string;
}

export interface ApiError {
  error: string;
  message?: string;
}
