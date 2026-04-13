import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getClient } from '../../src/lib/client.js';

vi.mock('../../src/lib/client.js', () => ({
  getClient: vi.fn(),
}));

type RegisteredTool = {
  name: string;
  config: { inputSchema?: { parse: (args: unknown) => unknown } };
  handler: (args: Record<string, unknown>) => Promise<{
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  }>;
};

function createServerMock() {
  const tools = new Map<string, RegisteredTool>();

  return {
    server: {
      registerTool: vi.fn(
        (
          name: string,
          config: RegisteredTool['config'],
          handler: RegisteredTool['handler'],
        ) => {
          tools.set(name, { name, config, handler });
        },
      ),
    },
    tools,
  };
}

function createMockClient() {
  return {
    listWorkspaces: vi.fn().mockResolvedValue([{ id: 'ws-1', name: 'Workspace 1' }]),
    listProjects: vi.fn().mockResolvedValue([{ id: 'proj-1', name: 'Project 1' }]),
    getProject: vi.fn().mockResolvedValue({ id: 'proj-1', name: 'Project 1' }),
    createProject: vi.fn().mockResolvedValue({ id: 'proj-new', name: 'New Project' }),
    listColumns: vi.fn().mockResolvedValue([{ id: 'col-1', name: 'To Do', slug: 'to-do' }]),
    getTask: vi.fn().mockResolvedValue({ id: 'task-1', title: 'Task 1' }),
    createTask: vi.fn().mockResolvedValue({ id: 'task-new', title: 'New Task' }),
    updateTaskTitle: vi.fn().mockResolvedValue({ id: 'task-1', title: 'Updated' }),
    updateTaskDescription: vi.fn().mockResolvedValue({ id: 'task-1', description: 'New desc' }),
    updateTaskStatus: vi.fn().mockResolvedValue({ id: 'task-1', status: 'done' }),
    updateTaskPriority: vi.fn().mockResolvedValue({ id: 'task-1', priority: 'high' }),
    updateTaskAssignee: vi.fn().mockResolvedValue({ id: 'task-1', userId: 'user-1' }),
    updateTaskDueDate: vi.fn().mockResolvedValue({ id: 'task-1', dueDate: '2026-12-31' }),
    deleteTask: vi.fn().mockResolvedValue(undefined),
    updateProject: vi.fn().mockResolvedValue({ id: 'proj-1', name: 'Updated Project' }),
    deleteProject: vi.fn().mockResolvedValue({ id: 'proj-1', name: 'Deleted Project' }),
    listLabels: vi.fn().mockResolvedValue([{ id: 'label-1', name: 'bug' }]),
    createLabel: vi.fn().mockResolvedValue({ id: 'label-new', name: 'new-label' }),
    attachLabel: vi.fn().mockResolvedValue(undefined),
    updateLabel: vi.fn().mockResolvedValue({ id: 'label-1', name: 'updated' }),
    deleteLabel: vi.fn().mockResolvedValue(undefined),
    listTaskLabels: vi.fn().mockResolvedValue([{ id: 'label-1', name: 'bug' }]),
    detachLabel: vi.fn().mockResolvedValue(undefined),
    addComment: vi.fn().mockResolvedValue({ command: 'INSERT', rowCount: 1 }),
    listComments: vi.fn().mockResolvedValue([{ id: 'comment-1', text: 'Hello' }]),
    editComment: vi.fn().mockResolvedValue({ id: 'comment-1', comment: 'Updated' }),
    deleteComment: vi.fn().mockResolvedValue(undefined),
    search: vi.fn().mockResolvedValue({ results: [], totalCount: 0, tasks: [] }),
    listSubtasks: vi.fn().mockResolvedValue([{ id: 'subtask-1', title: 'Subtask 1' }]),
  };
}

describe('MCP Tool Handlers', () => {
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(() => {
    mockClient = createMockClient();
    (getClient as ReturnType<typeof vi.fn>).mockReturnValue(mockClient);
  });

  describe('Workspace tools', () => {
    it('registers kaneo_list_workspaces', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      expect(server.registerTool).toHaveBeenCalledWith(
        'kaneo_list_workspaces',
        expect.any(Object),
        expect.any(Function),
      );

      const result = await tools.get('kaneo_list_workspaces')?.handler({});
      
      expect(result).toEqual({
        content: [{ type: 'text', text: JSON.stringify([{ id: 'ws-1', name: 'Workspace 1' }]) }],
        isError: undefined,
      });
    });
  });

  describe('Project tools', () => {
    it('registers kaneo_list_projects', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_list_projects')?.handler({ workspaceId: 'ws-123' });
      
      expect(mockClient.listProjects).toHaveBeenCalledWith('ws-123');
      expect(result?.content[0].type).toBe('text');
    });

    it('registers kaneo_get_project', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_get_project')?.handler({ projectId: 'proj-1' });
      
      expect(mockClient.getProject).toHaveBeenCalledWith('proj-1');
      expect(result?.content[0].type).toBe('text');
    });

    it('registers kaneo_create_project', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_create_project')?.handler({
        name: 'New Project',
        workspaceId: 'ws-123',
        slug: 'new-project',
        icon: '🚀',
      });
      
      expect(mockClient.createProject).toHaveBeenCalledWith({
        name: 'New Project',
        workspaceId: 'ws-123',
        slug: 'new-project',
        icon: '🚀',
      });
      expect(result?.content[0].type).toBe('text');
    });

    it('registers kaneo_update_project', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_update_project')?.handler({
        projectId: 'proj-1',
        name: 'Updated Project',
        slug: 'updated-project',
        description: 'Updated description',
        isPublic: true,
      });
      
      expect(mockClient.updateProject).toHaveBeenCalledWith('proj-1', {
        name: 'Updated Project',
        slug: 'updated-project',
        description: 'Updated description',
        isPublic: true,
      });
      expect(result?.content[0].type).toBe('text');
    });

    it('registers kaneo_delete_project', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_delete_project')?.handler({
        projectId: 'proj-1',
      });
      
      expect(mockClient.deleteProject).toHaveBeenCalledWith('proj-1');
      expect(result?.content[0].text).toContain('success');
    });

    it('registers kaneo_list_columns', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_list_columns')?.handler({ projectId: 'proj-1' });
      
      expect(mockClient.listColumns).toHaveBeenCalledWith('proj-1');
      expect(result?.content[0].type).toBe('text');
    });
  });

  describe('Task tools', () => {
    it('registers kaneo_get_task', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_get_task')?.handler({ taskId: 'task-1' });
      
      expect(mockClient.getTask).toHaveBeenCalledWith('task-1');
      expect(result?.content[0].text).toContain('task-1');
    });

    it('registers kaneo_create_task', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_create_task')?.handler({
        projectId: 'proj-1',
        title: 'New Task',
        description: 'Description',
        priority: 'medium',
        status: 'to-do',
      });
      
      expect(mockClient.createTask).toHaveBeenCalledWith('proj-1', {
        title: 'New Task',
        description: 'Description',
        priority: 'medium',
        status: 'to-do',
      });
      expect(result?.content[0].text).toContain('task-new');
    });

    it('registers kaneo_update_task_title', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_update_task_title')?.handler({
        taskId: 'task-1',
        title: 'Updated Title',
      });
      
      expect(mockClient.updateTaskTitle).toHaveBeenCalledWith('task-1', 'Updated Title');
      expect(result?.content[0].text).toContain('Updated');
    });

    it('registers kaneo_update_task_description', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_update_task_description')?.handler({
        taskId: 'task-1',
        description: 'New description',
      });
      
      expect(mockClient.updateTaskDescription).toHaveBeenCalledWith('task-1', 'New description');
      expect(result?.content[0].text).toContain('description');
    });

    it('registers kaneo_update_task_status', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_update_task_status')?.handler({
        taskId: 'task-1',
        status: 'in-progress',
      });
      
      expect(mockClient.updateTaskStatus).toHaveBeenCalledWith('task-1', 'in-progress');
      expect(result?.content[0].text).toContain('status');
    });

    it('registers kaneo_delete_task', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_delete_task')?.handler({ taskId: 'task-1' });
      
      expect(mockClient.deleteTask).toHaveBeenCalledWith('task-1');
      expect(result?.content[0].text).toContain('success');
      expect(result?.content[0].text).toContain('task-1');
    });

    it('registers kaneo_update_task_priority', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_update_task_priority')?.handler({
        taskId: 'task-1',
        priority: 'high',
      });
      
      expect(mockClient.updateTaskPriority).toHaveBeenCalledWith('task-1', 'high');
      expect(result?.content[0].text).toContain('priority');
    });

    it('registers kaneo_update_task_assignee', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_update_task_assignee')?.handler({
        taskId: 'task-1',
        userId: 'user-123',
      });
      
      expect(mockClient.updateTaskAssignee).toHaveBeenCalledWith('task-1', 'user-123');
      expect(result?.content[0].text).toContain('userId');
    });

    it('registers kaneo_update_task_due_date', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_update_task_due_date')?.handler({
        taskId: 'task-1',
        dueDate: '2026-12-31T23:59:00Z',
      });
      
      expect(mockClient.updateTaskDueDate).toHaveBeenCalledWith('task-1', '2026-12-31T23:59:00Z');
      expect(result?.content[0].text).toContain('dueDate');
    });
  });

  describe('Label tools', () => {
    it('registers kaneo_list_labels', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_list_labels')?.handler({ workspaceId: 'ws-1' });
      
      expect(mockClient.listLabels).toHaveBeenCalledWith('ws-1');
      expect(result?.content[0].text).toContain('label-1');
    });

    it('registers kaneo_create_label', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_create_label')?.handler({
        workspaceId: 'ws-1',
        name: 'bug',
        color: '#ef4444',
      });
      
      expect(mockClient.createLabel).toHaveBeenCalledWith({
        workspaceId: 'ws-1',
        name: 'bug',
        color: '#ef4444',
      });
    });

    it('registers kaneo_attach_label', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_attach_label')?.handler({
        labelId: 'label-1',
        taskId: 'task-1',
      });
      
      expect(mockClient.attachLabel).toHaveBeenCalledWith('label-1', 'task-1');
      expect(result?.content[0].text).toContain('success');
    });

    it('registers kaneo_update_label', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_update_label')?.handler({
        labelId: 'label-1',
        name: 'updated-name',
        color: '#3b82f6',
      });
      
      expect(mockClient.updateLabel).toHaveBeenCalledWith('label-1', {
        name: 'updated-name',
        color: '#3b82f6',
      });
    });

    it('registers kaneo_delete_label', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_delete_label')?.handler({ labelId: 'label-1' });
      
      expect(mockClient.deleteLabel).toHaveBeenCalledWith('label-1');
      expect(result?.content[0].text).toContain('success');
    });

    it('registers kaneo_list_task_labels', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_list_task_labels')?.handler({ taskId: 'task-1' });
      
      expect(mockClient.listTaskLabels).toHaveBeenCalledWith('task-1');
    });

    it('registers kaneo_detach_label', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_detach_label')?.handler({
        labelId: 'label-1',
        taskId: 'task-1',
      });
      
      expect(mockClient.detachLabel).toHaveBeenCalledWith('label-1', 'task-1');
      expect(result?.content[0].text).toContain('success');
    });
  });

  describe('Comment tools', () => {
    it('registers kaneo_add_comment', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_add_comment')?.handler({
        taskId: 'task-1',
        comment: 'Test comment',
      });
      
      expect(mockClient.addComment).toHaveBeenCalledWith('task-1', 'Test comment');
      expect(result?.content[0].text).toContain('INSERT');
    });

    it('registers kaneo_list_comments', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_list_comments')?.handler({ taskId: 'task-1' });
      
      expect(mockClient.listComments).toHaveBeenCalledWith('task-1');
      expect(result?.content[0].text).toContain('comment-1');
    });

    it('registers kaneo_edit_comment', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_edit_comment')?.handler({
        commentId: 'comment-1',
        comment: 'Updated comment',
      });
      
      expect(mockClient.editComment).toHaveBeenCalledWith('comment-1', 'Updated comment');
      expect(result?.content[0].text).toContain('comment');
    });

    it('registers kaneo_delete_comment', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_delete_comment')?.handler({ commentId: 'comment-1' });
      
      expect(mockClient.deleteComment).toHaveBeenCalledWith('comment-1');
      expect(result?.content[0].text).toContain('success');
    });
  });

  describe('Search tool', () => {
    it('registers kaneo_search', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_search')?.handler({
        query: 'test search',
        type: 'tasks',
        workspaceId: 'ws-1',
        projectId: 'proj-1',
        limit: 10,
      });
      
      expect(mockClient.search).toHaveBeenCalledWith('test search', {
        type: 'tasks',
        workspaceId: 'ws-1',
        projectId: 'proj-1',
        limit: 10,
      });
      expect(result?.content[0].text).toContain('totalCount');
    });
  });

  describe('Subtask tools', () => {
    it('registers kaneo_list_subtasks', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_list_subtasks')?.handler({ parentTaskId: 'task-123' });
      
      expect(mockClient.listSubtasks).toHaveBeenCalledWith('task-123');
      expect(result?.content[0].type).toBe('text');
      expect(result?.content[0].text).toContain('subtask-1');
    });
  });

  describe('Response format', () => {
    it('returns correct MCP response format', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const result = await tools.get('kaneo_list_workspaces')?.handler({});
      
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result?.content)).toBe(true);
      expect(result?.content[0]).toHaveProperty('type', 'text');
      expect(result?.content[0]).toHaveProperty('text');
      expect(result?.isError).toBeUndefined();
    });
  });

  describe('Error handling', () => {
    it('throws error when client throws (handlers do not catch errors)', async () => {
      const errorClient = {
        ...createMockClient(),
        listWorkspaces: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      (getClient as ReturnType<typeof vi.fn>).mockReturnValue(errorClient);

      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      // Current implementation doesn't catch errors - they propagate
      await expect(tools.get('kaneo_list_workspaces')?.handler({})).rejects.toThrow('API Error');
    });
  });

  describe('Tool count', () => {
    it('registers all 18 tools', async () => {
      const { server, tools } = createServerMock();
      const { registerTools } = await import('../../src/index.js');
      
      registerTools(server as never);

      const expectedTools = [
        'kaneo_list_workspaces',
        'kaneo_list_projects',
        'kaneo_get_project',
        'kaneo_create_project',
        'kaneo_update_project',
        'kaneo_delete_project',
        'kaneo_list_columns',
        'kaneo_get_task',
        'kaneo_create_task',
        'kaneo_update_task_title',
        'kaneo_update_task_description',
        'kaneo_update_task_status',
        'kaneo_update_task_priority',
        'kaneo_update_task_assignee',
        'kaneo_update_task_due_date',
        'kaneo_delete_task',
        'kaneo_list_labels',
        'kaneo_create_label',
        'kaneo_attach_label',
        'kaneo_update_label',
        'kaneo_delete_label',
        'kaneo_list_task_labels',
        'kaneo_detach_label',
        'kaneo_add_comment',
        'kaneo_list_comments',
        'kaneo_edit_comment',
        'kaneo_delete_comment',
        'kaneo_search',
        'kaneo_list_subtasks',
      ];

      for (const toolName of expectedTools) {
        expect(tools.has(toolName)).toBe(true);
      }

      expect(tools.size).toBe(29);
    });
  });
});