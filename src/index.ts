import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getClient } from './lib/client.js';

const priorityEnum = z.enum(['no-priority', 'low', 'medium', 'high', 'urgent']);
const searchTypeEnum = z.enum(['all', 'tasks', 'projects', 'workspaces', 'comments', 'activities']);

export function registerTools(server: McpServer): void {
  server.registerTool(
    'kaneo_list_workspaces',
    {
      title: 'List Workspaces',
      description: 'List all accessible workspaces in Kaneo',
      inputSchema: {} as any,
    },
    async () => {
      const client = getClient();
      const workspaces = await client.listWorkspaces();
      return { content: [{ type: 'text' as const, text: JSON.stringify(workspaces) }] };
    }
  );

  server.registerTool(
    'kaneo_list_projects',
    {
      title: 'List Projects',
      description: 'List all projects in a Kaneo workspace',
      inputSchema: z.object({
        workspaceId: z.string().describe('Workspace ID'),
      }) as unknown as any,
    },
    async ({ workspaceId }: any) => {
      const client = getClient();
      const projects = await client.listProjects(workspaceId);
      return { content: [{ type: 'text' as const, text: JSON.stringify(projects) }] };
    }
  );

  server.registerTool(
    'kaneo_get_project',
    {
      title: 'Get Project',
      description: 'Get details of a specific Kaneo project',
      inputSchema: z.object({
        projectId: z.string().describe('Project ID'),
      }) as unknown as any,
    },
    async ({ projectId }: any) => {
      const client = getClient();
      const project = await client.getProject(projectId);
      return { content: [{ type: 'text' as const, text: JSON.stringify(project) }] };
    }
  );

  server.registerTool(
    'kaneo_create_project',
    {
      title: 'Create Project',
      description: 'Create a new project in a Kaneo workspace. For icon, suggest based on project name: use Layout as default, or Code for dev projects, FileText for docs, Target for goals, Rocket for launches, Users for team projects.',
      inputSchema: z.object({
        name: z.string().describe('Project name'),
        slug: z.string().describe('Project slug (URL-friendly, e.g., "my-project"). Suggest from name by converting to kebab-case.'),
        workspaceId: z.string().describe('Workspace ID'),
        icon: z.string().optional().describe('Project icon name (default: Layout)'),
      }) as unknown as any,
    },
    async ({ name, slug, workspaceId, icon }: any) => {
      const client = getClient();
      const project = await client.createProject({ name, slug, workspaceId, icon: icon || 'Layout' });
      return { content: [{ type: 'text' as const, text: JSON.stringify(project) }] };
    }
  );

  server.registerTool(
    'kaneo_update_project',
    {
      title: 'Update Project',
      description: 'Update an existing Kaneo project',
      inputSchema: z.object({
        projectId: z.string().describe('Project ID to update'),
        name: z.string().optional().describe('New project name'),
        slug: z.string().optional().describe('New project slug'),
        icon: z.string().optional().describe('New project icon'),
        description: z.string().optional().describe('Project description'),
        isPublic: z.boolean().optional().describe('Make project public'),
      }) as unknown as any,
    },
    async ({ projectId, name, slug, icon, description, isPublic }: any) => {
      const client = getClient();
      const project = await client.updateProject(projectId, { name, slug, icon, description, isPublic });
      return { content: [{ type: 'text' as const, text: JSON.stringify(project) }] };
    }
  );

  server.registerTool(
    'kaneo_delete_project',
    {
      title: 'Delete Project',
      description: 'Delete a Kaneo project',
      inputSchema: z.object({
        projectId: z.string().describe('Project ID to delete'),
      }) as unknown as any,
    },
    async ({ projectId }: any) => {
      const client = getClient();
      await client.deleteProject(projectId);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, projectId }) }] };
    }
  );

  server.registerTool(
    'kaneo_get_task',
    {
      title: 'Get Task',
      description: 'Get details of a specific Kaneo task',
      inputSchema: z.object({
        taskId: z.string().describe('Task ID'),
      }) as unknown as any,
    },
    async ({ taskId }: any) => {
      const client = getClient();
      const task = await client.getTask(taskId);
      return { content: [{ type: 'text' as const, text: JSON.stringify(task) }] };
    }
  );

  server.registerTool(
    'kaneo_create_task',
    {
      title: 'Create Task',
      description: 'Create a new task in a Kaneo project',
      inputSchema: z.object({
        projectId: z.string().describe('Project ID'),
        title: z.string().describe('Task title'),
        description: z.string().describe('Task description (supports markdown)'),
        priority: priorityEnum.describe('Task priority'),
        status: z.string().describe('Column slug (e.g., "to-do", "in-progress", "done")'),
      }) as unknown as any,
    },
    async ({ projectId, title, description, priority, status }: any) => {
      const client = getClient();
      const task = await client.createTask(projectId, { title, description, priority, status });
      return { content: [{ type: 'text' as const, text: JSON.stringify(task) }] };
    }
  );

  server.registerTool(
    'kaneo_update_task_title',
    {
      title: 'Update Task Title',
      description: 'Update the title of a Kaneo task',
      inputSchema: z.object({
        taskId: z.string().describe('Task ID'),
        title: z.string().describe('New task title'),
      }) as unknown as any,
    },
    async ({ taskId, title }: any) => {
      const client = getClient();
      const task = await client.updateTaskTitle(taskId, title);
      return { content: [{ type: 'text' as const, text: JSON.stringify(task) }] };
    }
  );

  server.registerTool(
    'kaneo_update_task_description',
    {
      title: 'Update Task Description',
      description: 'Update the description of a Kaneo task',
      inputSchema: z.object({
        taskId: z.string().describe('Task ID'),
        description: z.string().describe('New task description (supports markdown)'),
      }) as unknown as any,
    },
    async ({ taskId, description }: any) => {
      const client = getClient();
      const task = await client.updateTaskDescription(taskId, description);
      return { content: [{ type: 'text' as const, text: JSON.stringify(task) }] };
    }
  );

  server.registerTool(
    'kaneo_update_task_status',
    {
      title: 'Update Task Status',
      description: 'Move a Kaneo task to a different column/status',
      inputSchema: z.object({
        taskId: z.string().describe('Task ID'),
        status: z.string().describe('Column slug (e.g., "to-do", "in-progress", "done", "planned")'),
      }) as unknown as any,
    },
    async ({ taskId, status }: any) => {
      const client = getClient();
      const task = await client.updateTaskStatus(taskId, status);
      return { content: [{ type: 'text' as const, text: JSON.stringify(task) }] };
    }
  );

  server.registerTool(
    'kaneo_delete_task',
    {
      title: 'Delete Task',
      description: 'Delete a Kaneo task',
      inputSchema: z.object({
        taskId: z.string().describe('Task ID to delete'),
      }) as unknown as any,
    },
    async ({ taskId }: any) => {
      const client = getClient();
      await client.deleteTask(taskId);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, taskId }) }] };
    }
  );

  server.registerTool(
    'kaneo_list_columns',
    {
      title: 'List Columns',
      description: 'List all columns in a Kaneo project',
      inputSchema: z.object({
        projectId: z.string().describe('Project ID'),
      }) as unknown as any,
    },
    async ({ projectId }: any) => {
      const client = getClient();
      const columns = await client.listColumns(projectId);
      return { content: [{ type: 'text' as const, text: JSON.stringify(columns) }] };
    }
  );

  server.registerTool(
    'kaneo_update_task_priority',
    {
      title: 'Update Task Priority',
      description: 'Update the priority of a Kaneo task',
      inputSchema: z.object({
        taskId: z.string().describe('Task ID'),
        priority: priorityEnum.describe('Task priority'),
      }) as unknown as any,
    },
    async ({ taskId, priority }: any) => {
      const client = getClient();
      const task = await client.updateTaskPriority(taskId, priority);
      return { content: [{ type: 'text' as const, text: JSON.stringify(task) }] };
    }
  );

  server.registerTool(
    'kaneo_update_task_assignee',
    {
      title: 'Update Task Assignee',
      description: 'Update the assignee of a Kaneo task',
      inputSchema: z.object({
        taskId: z.string().describe('Task ID'),
        userId: z.string().nullable().describe('User ID to assign (null to unassign)'),
      }) as unknown as any,
    },
    async ({ taskId, userId }: any) => {
      const client = getClient();
      const task = await client.updateTaskAssignee(taskId, userId);
      return { content: [{ type: 'text' as const, text: JSON.stringify(task) }] };
    }
  );

  server.registerTool(
    'kaneo_update_task_due_date',
    {
      title: 'Update Task Due Date',
      description: 'Update the due date of a Kaneo task',
      inputSchema: z.object({
        taskId: z.string().describe('Task ID'),
        dueDate: z.string().describe('Due date (ISO 8601 format, e.g., 2026-12-31T23:59:00Z)'),
      }) as unknown as any,
    },
    async ({ taskId, dueDate }: any) => {
      const client = getClient();
      const task = await client.updateTaskDueDate(taskId, dueDate);
      return { content: [{ type: 'text' as const, text: JSON.stringify(task) }] };
    }
  );

  server.registerTool(
    'kaneo_list_labels',
    {
      title: 'List Labels',
      description: 'List all labels in a Kaneo workspace',
      inputSchema: z.object({
        workspaceId: z.string().describe('Workspace ID'),
      }) as unknown as any,
    },
    async ({ workspaceId }: any) => {
      const client = getClient();
      const labels = await client.listLabels(workspaceId);
      return { content: [{ type: 'text' as const, text: JSON.stringify(labels) }] };
    }
  );

  server.registerTool(
    'kaneo_create_label',
    {
      title: 'Create Label',
      description: 'Create a new label in a Kaneo workspace',
      inputSchema: z.object({
        workspaceId: z.string().describe('Workspace ID'),
        name: z.string().describe('Label name'),
        color: z.string().describe('Hex color code (e.g., "#ef4444", "#22c55e")'),
      }) as unknown as any,
    },
    async ({ workspaceId, name, color }: any) => {
      const client = getClient();
      const label = await client.createLabel({ workspaceId, name, color });
      return { content: [{ type: 'text' as const, text: JSON.stringify(label) }] };
    }
  );

  server.registerTool(
    'kaneo_attach_label',
    {
      title: 'Attach Label',
      description: 'Attach a label to a Kaneo task',
      inputSchema: z.object({
        labelId: z.string().describe('Label ID'),
        taskId: z.string().describe('Task ID'),
      }) as unknown as any,
    },
    async ({ labelId, taskId }: any) => {
      const client = getClient();
      await client.attachLabel(labelId, taskId);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, labelId, taskId }) }] };
    }
  );

  server.registerTool(
    'kaneo_update_label',
    {
      title: 'Update Label',
      description: 'Update a label name or color in Kaneo',
      inputSchema: z.object({
        labelId: z.string().describe('Label ID'),
        name: z.string().optional().describe('New label name'),
        color: z.string().optional().describe('Hex color code (e.g., "#ef4444", "#22c55e")'),
      }) as unknown as any,
    },
    async ({ labelId, name, color }: any) => {
      const client = getClient();
      const label = await client.updateLabel(labelId, { name, color });
      return { content: [{ type: 'text' as const, text: JSON.stringify(label) }] };
    }
  );

  server.registerTool(
    'kaneo_delete_label',
    {
      title: 'Delete Label',
      description: 'Delete a label from Kaneo',
      inputSchema: z.object({
        labelId: z.string().describe('Label ID to delete'),
      }) as unknown as any,
    },
    async ({ labelId }: any) => {
      const client = getClient();
      await client.deleteLabel(labelId);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, labelId }) }] };
    }
  );

  server.registerTool(
    'kaneo_list_task_labels',
    {
      title: 'List Task Labels',
      description: 'List all labels attached to a Kaneo task',
      inputSchema: z.object({
        taskId: z.string().describe('Task ID'),
      }) as unknown as any,
    },
    async ({ taskId }: any) => {
      const client = getClient();
      const labels = await client.listTaskLabels(taskId);
      return { content: [{ type: 'text' as const, text: JSON.stringify(labels) }] };
    }
  );

  server.registerTool(
    'kaneo_detach_label',
    {
      title: 'Detach Label',
      description: 'Detach a label from a Kaneo task',
      inputSchema: z.object({
        labelId: z.string().describe('Label ID'),
        taskId: z.string().describe('Task ID'),
      }) as unknown as any,
    },
    async ({ labelId, taskId }: any) => {
      const client = getClient();
      await client.detachLabel(labelId, taskId);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, labelId, taskId }) }] };
    }
  );

  server.registerTool(
    'kaneo_add_comment',
    {
      title: 'Add Comment',
      description: 'Add a comment to a Kaneo task',
      inputSchema: z.object({
        taskId: z.string().describe('Task ID'),
        comment: z.string().describe('Comment text'),
      }) as unknown as any,
    },
    async ({ taskId, comment }: any) => {
      const client = getClient();
      const result = await client.addComment(taskId, comment);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    }
  );

  server.registerTool(
    'kaneo_list_comments',
    {
      title: 'List Comments',
      description: 'List all comments on a Kaneo task',
      inputSchema: z.object({
        taskId: z.string().describe('Task ID'),
      }) as unknown as any,
    },
    async ({ taskId }: any) => {
      const client = getClient();
      const comments = await client.listComments(taskId);
      return { content: [{ type: 'text' as const, text: JSON.stringify(comments) }] };
    }
  );

  server.registerTool(
    'kaneo_edit_comment',
    {
      title: 'Edit Comment',
      description: 'Edit a comment on a Kaneo task',
      inputSchema: z.object({
        commentId: z.string().describe('Comment/Activity ID'),
        comment: z.string().describe('New comment text'),
      }) as unknown as any,
    },
    async ({ commentId, comment }: any) => {
      const client = getClient();
      const result = await client.editComment(commentId, comment);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    }
  );

  server.registerTool(
    'kaneo_delete_comment',
    {
      title: 'Delete Comment',
      description: 'Delete a comment from a Kaneo task',
      inputSchema: z.object({
        commentId: z.string().describe('Comment/Activity ID to delete'),
      }) as unknown as any,
    },
    async ({ commentId }: any) => {
      const client = getClient();
      await client.deleteComment(commentId);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, commentId }) }] };
    }
  );

  server.registerTool(
    'kaneo_search',
    {
      title: 'Search',
      description: 'Search for tasks, projects, or comments in Kaneo',
      inputSchema: z.object({
        query: z.string().describe('Search query'),
        type: searchTypeEnum.optional().describe('Search type'),
        workspaceId: z.string().optional().describe('Filter by workspace ID'),
        projectId: z.string().optional().describe('Filter by project ID'),
        limit: z.number().min(1).max(50).optional().describe('Maximum results (default 20)'),
      }) as unknown as any,
    },
    async ({ query, type, workspaceId, projectId, limit }: any) => {
      const client = getClient();
      const results = await client.search(query, { type, workspaceId, projectId, limit });
      return { content: [{ type: 'text' as const, text: JSON.stringify(results) }] };
    }
  );

  server.registerTool(
    'kaneo_list_subtasks',
    {
      title: 'List Subtasks',
      description: 'List subtasks of a parent task (uses "[Parent #taskId]" description pattern)',
      inputSchema: z.object({
        parentTaskId: z.string().describe('Parent task ID'),
      }) as unknown as any,
    },
    async ({ parentTaskId }: any) => {
      const client = getClient();
      const subtasks = await client.listSubtasks(parentTaskId);
      return { content: [{ type: 'text' as const, text: JSON.stringify(subtasks) }] };
    }
  );
}

const server = new McpServer({
  name: 'kaneo',
  version: '0.1.0',
});

registerTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);