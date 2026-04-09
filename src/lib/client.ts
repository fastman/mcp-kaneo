import type {
  Workspace,
  Project,
  Column,
  Task,
  Label,
  Comment,
  CommentResult,
  SearchResult,
  TasksResponse,
  CreateTaskInput,
  CreateLabelInput,
} from './types.js';

export class KaneoClient {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.token = token;
  }

  async createWorkspace(name: string, slug: string): Promise<Workspace> {
    return this.request<Workspace>('/auth/organization/create', {
      method: 'POST',
      body: JSON.stringify({ name, slug }),
    });
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText || 'Request failed'}`);
    }

    return response.json() as T;
  }

  async listWorkspaces(): Promise<Workspace[]> {
    return this.request<Workspace[]>('/auth/organization/list');
  }

  async listProjects(workspaceId: string): Promise<Project[]> {
    return this.request<Project[]>(`/project?workspaceId=${workspaceId}`);
  }

  async getProject(projectId: string): Promise<Project> {
    return this.request<Project>(`/project/${projectId}`);
  }

  async createProject(data: { name: string; workspaceId: string; slug: string; icon?: string }): Promise<Project> {
    return this.request<Project>('/project', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listColumns(projectId: string): Promise<Column[]> {
    return this.request<Column[]>(`/column/${projectId}`);
  }

  async getTask(taskId: string): Promise<Task> {
    return this.request<Task>(`/task/${taskId}`);
  }

  async listTasks(projectId: string): Promise<TasksResponse> {
    return this.request<TasksResponse>(`/task/tasks/${projectId}`);
  }

  async createTask(projectId: string, data: Omit<CreateTaskInput, 'projectId'>): Promise<Task> {
    return this.request<Task>(`/task/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(taskId: string, data: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/task/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateTaskTitle(taskId: string, title: string): Promise<Task> {
    return this.request<Task>(`/task/title/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    });
  }

  async updateTaskDescription(taskId: string, description: string): Promise<Task> {
    return this.request<Task>(`/task/description/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ description }),
    });
  }

  async updateTaskStatus(taskId: string, status: string): Promise<Task> {
    return this.request<Task>(`/task/status/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.request<void>(`/task/${taskId}`, {
      method: 'DELETE',
    });
  }

  async updateTaskPriority(taskId: string, priority: string): Promise<Task> {
    return this.request<Task>(`/task/priority/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ priority }),
    });
  }

  async updateTaskAssignee(taskId: string, userId: string | null): Promise<Task> {
    return this.request<Task>(`/task/assignee/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ userId }),
    });
  }

  async updateTaskDueDate(taskId: string, dueDate: string): Promise<Task> {
    return this.request<Task>(`/task/due-date/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ dueDate }),
    });
  }

  async deleteProject(projectId: string): Promise<void> {
    await this.request<void>(`/project/${projectId}`, {
      method: 'DELETE',
    });
  }

  async listLabels(workspaceId: string): Promise<Label[]> {
    return this.request<Label[]>(`/label/workspace/${workspaceId}`);
  }

  async getLabel(labelId: string): Promise<Label> {
    return this.request<Label>(`/label/${labelId}`);
  }

  async createLabel(data: CreateLabelInput): Promise<Label> {
    return this.request<Label>('/label', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLabel(labelId: string, data: { name?: string; color?: string }): Promise<Label> {
    return this.request<Label>(`/label/${labelId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLabel(labelId: string): Promise<void> {
    await this.request<void>(`/label/${labelId}`, {
      method: 'DELETE',
    });
  }

  async attachLabel(labelId: string, taskId: string): Promise<void> {
    await this.request<void>(`/label/${labelId}/task`, {
      method: 'PUT',
      body: JSON.stringify({ taskId }),
    });
  }

  async detachLabel(labelId: string, taskId: string): Promise<void> {
    await this.request<void>(`/label/${labelId}/task?taskId=${taskId}`, {
      method: 'DELETE',
    });
  }

  async listTaskLabels(taskId: string): Promise<Label[]> {
    return this.request<Label[]>(`/label/task/${taskId}`);
  }

  async addComment(taskId: string, comment: string): Promise<CommentResult> {
    return this.request<CommentResult>('/activity/comment', {
      method: 'POST',
      body: JSON.stringify({ taskId, comment }),
    });
  }

  async listComments(taskId: string): Promise<Comment[]> {
    return this.request<Comment[]>(`/activity/${taskId}`);
  }

  async editComment(activityId: string, comment: string): Promise<Comment> {
    return this.request<Comment>('/activity/comment', {
      method: 'PUT',
      body: JSON.stringify({ activityId, comment }),
    });
  }

  async deleteComment(activityId: string): Promise<void> {
    await this.request<void>('/activity/comment', {
      method: 'DELETE',
      body: JSON.stringify({ activityId }),
    });
  }

  async search(query: string, options: {
    type?: 'all' | 'tasks' | 'projects' | 'workspaces' | 'comments' | 'activities';
    workspaceId?: string;
    projectId?: string;
    limit?: number;
  } = {}): Promise<SearchResult> {
    const params = new URLSearchParams({ q: query });
    
    if (options.type) params.set('type', options.type);
    if (options.workspaceId) params.set('workspaceId', options.workspaceId);
    if (options.projectId) params.set('projectId', options.projectId);
    if (options.limit) params.set('limit', options.limit.toString());

    return this.request<SearchResult>(`/search?${params.toString()}`);
  }

  async listSubtasks(parentTaskId: string): Promise<Task[]> {
    const result = await this.search(`[Parent #${parentTaskId}]`, { type: 'tasks', limit: 50 });
    return result.tasks || [];
  }
}

let client: KaneoClient | null = null;

export function getClient(): KaneoClient {
  if (client) return client;
  
  const { baseUrl, token } = requireConfig();
  client = new KaneoClient(baseUrl, token);
  return client;
}

function requireConfig(): { baseUrl: string; token: string } {
  const baseUrl = process.env.KANEO_BASE_URL;
  const token = process.env.KANEO_TOKEN;

  if (!baseUrl) {
    throw new Error('KANEO_BASE_URL is required');
  }
  
  if (!token) {
    throw new Error('KANEO_TOKEN is required');
  }

  let url = baseUrl;
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }

  return { baseUrl: url, token };
}
