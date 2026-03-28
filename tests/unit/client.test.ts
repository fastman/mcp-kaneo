import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { KaneoClient } from '../../src/lib/client.js';

describe('KaneoClient', () => {
  let client: KaneoClient;
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as unknown as Response);
    client = new KaneoClient('https://api.test', 'test-token');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  describe('Workspaces', () => {
    it('should list workspaces', async () => {
      const mockWorkspaces = [{ id: 'ws-1', name: 'Workspace 1' }];
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockWorkspaces),
      });

      const result = await client.listWorkspaces();

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/auth/organization/list',
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
        })
      );
      expect(result).toEqual(mockWorkspaces);
    });
  });

  describe('Projects', () => {
    it('should list projects in workspace', async () => {
      const mockProjects = [{ id: 'proj-1', name: 'Project 1' }];
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProjects),
      });

      const result = await client.listProjects('ws-123');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/project?workspaceId=ws-123',
        expect.any(Object)
      );
      expect(result).toEqual(mockProjects);
    });

    it('should get project by id', async () => {
      const mockProject = { id: 'proj-1', name: 'Project 1', slug: 'project-1' };
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProject),
      });

      const result = await client.getProject('proj-1');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/project/proj-1',
        expect.any(Object)
      );
      expect(result).toEqual(mockProject);
    });

    it('should create project', async () => {
      const mockProject = { id: 'proj-new', name: 'New Project', slug: 'new-project' };
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProject),
      });

      const result = await client.createProject({
        name: 'New Project',
        workspaceId: 'ws-123',
        slug: 'new-project',
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/project',
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result).toEqual(mockProject);
    });
  });

  describe('Tasks', () => {
    it('should create task', async () => {
      const mockTask = { id: 'task-1', title: 'Test Task', status: 'to-do' };
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTask),
      });

      const result = await client.createTask('proj-1', {
        title: 'Test Task',
        description: 'Description',
        priority: 'medium',
        status: 'to-do',
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/task/proj-1',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            title: 'Test Task',
            description: 'Description',
            priority: 'medium',
            status: 'to-do',
          }),
        })
      );
      expect(result).toEqual(mockTask);
    });

    it('should get task', async () => {
      const mockTask = { id: 'task-1', title: 'Test Task' };
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTask),
      });

      const result = await client.getTask('task-1');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/task/task-1',
        expect.any(Object)
      );
      expect(result).toEqual(mockTask);
    });

    it('should update task title', async () => {
      const mockTask = { id: 'task-1', title: 'Updated Title' };
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTask),
      });

      const result = await client.updateTaskTitle('task-1', 'Updated Title');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/task/title/task-1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ title: 'Updated Title' }),
        })
      );
      expect(result).toEqual(mockTask);
    });

    it('should update task description', async () => {
      const mockTask = { id: 'task-1', description: 'Updated Description' };
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTask),
      });

      const result = await client.updateTaskDescription('task-1', 'Updated Description');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/task/description/task-1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ description: 'Updated Description' }),
        })
      );
    });

    it('should update task status', async () => {
      const mockTask = { id: 'task-1', status: 'in-progress' };
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTask),
      });

      const result = await client.updateTaskStatus('task-1', 'in-progress');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/task/status/task-1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ status: 'in-progress' }),
        })
      );
      expect(result).toEqual(mockTask);
    });



    it('should delete task', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await client.deleteTask('task-1');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/task/task-1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('should list tasks in project', async () => {
      const mockResponse = { data: { id: 'proj-1', columns: [] }, pagination: { total: 0 } };
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.listTasks('proj-1');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/task/tasks/proj-1',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Labels', () => {
    it('should list workspace labels', async () => {
      const mockLabels = [{ id: 'label-1', name: 'bug', color: '#ef4444' }];
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLabels),
      });

      const result = await client.listLabels('ws-123');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/label/workspace/ws-123',
        expect.any(Object)
      );
      expect(result).toEqual(mockLabels);
    });

    it('should create label', async () => {
      const mockLabel = { id: 'label-new', name: 'new-label', color: '#22c55e' };
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLabel),
      });

      const result = await client.createLabel({
        workspaceId: 'ws-123',
        name: 'new-label',
        color: '#22c55e',
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/label',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            workspaceId: 'ws-123',
            name: 'new-label',
            color: '#22c55e',
          }),
        })
      );
      expect(result).toEqual(mockLabel);
    });

    it('should get label', async () => {
      const mockLabel = { id: 'label-1', name: 'bug', color: '#ef4444' };
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLabel),
      });

      const result = await client.getLabel('label-1');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/label/label-1',
        expect.any(Object)
      );
      expect(result).toEqual(mockLabel);
    });

    it('should update label', async () => {
      const mockLabel = { id: 'label-1', name: 'updated', color: '#3b82f6' };
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLabel),
      });

      const result = await client.updateLabel('label-1', {
        name: 'updated',
        color: '#3b82f6',
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/label/label-1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'updated', color: '#3b82f6' }),
        })
      );
      expect(result).toEqual(mockLabel);
    });

    it('should delete label', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await client.deleteLabel('label-1');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/label/label-1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('should attach label to task', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await client.attachLabel('label-1', 'task-1');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/label/label-1/task',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ taskId: 'task-1' }),
        })
      );
    });

    it('should detach label from task', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await client.detachLabel('label-1', 'task-1');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/label/label-1/task?taskId=task-1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('should list labels on task', async () => {
      const mockLabels = [{ id: 'label-1', name: 'bug' }];
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLabels),
      });

      const result = await client.listTaskLabels('task-1');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/label/task/task-1',
        expect.any(Object)
      );
      expect(result).toEqual(mockLabels);
    });
  });

  describe('Comments', () => {
    it('should add comment', async () => {
      const mockResult = { command: 'INSERT', rowCount: 1 };
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResult),
      });

      const result = await client.addComment('task-1', 'Test comment');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/activity/comment',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ taskId: 'task-1', comment: 'Test comment' }),
        })
      );
      expect(result).toEqual(mockResult);
    });

    it('should list comments on task', async () => {
      const mockComments = [{ id: 'comment-1', comment: 'Test' }];
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockComments),
      });

      const result = await client.listComments('task-1');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/activity/task-1',
        expect.any(Object)
      );
      expect(result).toEqual(mockComments);
    });
  });

  describe('Search', () => {
    it('should search with query only', async () => {
      const mockResults = { results: [], totalCount: 0, searchQuery: 'test' };
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResults),
      });

      const result = await client.search('test');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/search?q=test',
        expect.any(Object)
      );
      expect(result).toEqual(mockResults);
    });

    it('should search with filters', async () => {
      const mockResults = { results: [], totalCount: 0, searchQuery: 'bug' };
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResults),
      });

      const result = await client.search('bug', {
        type: 'tasks',
        workspaceId: 'ws-123',
        projectId: 'proj-1',
        limit: 10,
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test/search?q=bug&type=tasks&workspaceId=ws-123&projectId=proj-1&limit=10',
        expect.any(Object)
      );
      expect(result).toEqual(mockResults);
    });
  });

  describe('Error handling', () => {
    it('should throw on 401 error', async () => {
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      });

      await expect(client.listWorkspaces()).rejects.toThrow('401: Unauthorized');
    });

    it('should throw on 404 error', async () => {
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not Found'),
      });

      await expect(client.getTask('nonexistent')).rejects.toThrow('404: Not Found');
    });

    it('should throw on 400 validation error', async () => {
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 400,
        text: () => Promise.resolve(JSON.stringify({ error: { message: 'Invalid input' } })),
      });

      await expect(client.listWorkspaces()).rejects.toThrow('400');
    });
  });
});
