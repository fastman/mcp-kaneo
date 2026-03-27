import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getClient } from './lib/client.js';

const server = new McpServer({
  name: 'kaneo',
  version: '0.1.0',
});

const priorityEnum = z.enum(['no-priority', 'low', 'medium', 'high', 'urgent']);
const searchTypeEnum = z.enum(['all', 'tasks', 'projects', 'workspaces', 'comments', 'activities']);

server.registerTool(
  'kaneo_list_workspaces',
  {
    title: 'List Workspaces',
    description: 'List all accessible workspaces in Kaneo',
    inputSchema: z.object({}),
    outputSchema: z.array(z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    })),
  },
  async () => {
    const client = getClient();
    const workspaces = await client.listWorkspaces();
    return { content: [{ type: 'text', text: JSON.stringify(workspaces, null, 2) }] };
  }
);

server.registerTool(
  'kaneo_list_projects',
  {
    title: 'List Projects',
    description: 'List all projects in a Kaneo workspace',
    inputSchema: z.object({
      workspaceId: z.string().describe('Workspace ID'),
    }),
  },
  async ({ workspaceId }) => {
    const client = getClient();
    const projects = await client.listProjects(workspaceId);
    return { content: [{ type: 'text', text: JSON.stringify(projects, null, 2) }] };
  }
);

server.registerTool(
  'kaneo_get_task',
  {
    title: 'Get Task',
    description: 'Get details of a specific Kaneo task',
    inputSchema: z.object({
      taskId: z.string().describe('Task ID'),
    }),
  },
  async ({ taskId }) => {
    const client = getClient();
    const task = await client.getTask(taskId);
    return { content: [{ type: 'text', text: JSON.stringify(task, null, 2) }] };
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
    }),
  },
  async ({ projectId, title, description, priority, status }) => {
    const client = getClient();
    const task = await client.createTask(projectId, { title, description, priority, status });
    return { content: [{ type: 'text', text: JSON.stringify(task, null, 2) }] };
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
    }),
  },
  async ({ taskId, title }) => {
    const client = getClient();
    const task = await client.updateTaskTitle(taskId, title);
    return { content: [{ type: 'text', text: JSON.stringify(task, null, 2) }] };
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
    }),
  },
  async ({ taskId, description }) => {
    const client = getClient();
    const task = await client.updateTaskDescription(taskId, description);
    return { content: [{ type: 'text', text: JSON.stringify(task, null, 2) }] };
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
    }),
  },
  async ({ taskId, status }) => {
    const client = getClient();
    const task = await client.updateTaskStatus(taskId, status);
    return { content: [{ type: 'text', text: JSON.stringify(task, null, 2) }] };
  }
);

server.registerTool(
  'kaneo_delete_task',
  {
    title: 'Delete Task',
    description: 'Delete a Kaneo task',
    inputSchema: z.object({
      taskId: z.string().describe('Task ID to delete'),
    }),
  },
  async ({ taskId }) => {
    const client = getClient();
    await client.deleteTask(taskId);
    return { content: [{ type: 'text', text: JSON.stringify({ success: true, taskId }, null, 2) }] };
  }
);

server.registerTool(
  'kaneo_list_labels',
  {
    title: 'List Labels',
    description: 'List all labels in a Kaneo workspace',
    inputSchema: z.object({
      workspaceId: z.string().describe('Workspace ID'),
    }),
  },
  async ({ workspaceId }) => {
    const client = getClient();
    const labels = await client.listLabels(workspaceId);
    return { content: [{ type: 'text', text: JSON.stringify(labels, null, 2) }] };
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
    }),
  },
  async ({ workspaceId, name, color }) => {
    const client = getClient();
    const label = await client.createLabel({ workspaceId, name, color });
    return { content: [{ type: 'text', text: JSON.stringify(label, null, 2) }] };
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
    }),
  },
  async ({ labelId, taskId }) => {
    const client = getClient();
    await client.attachLabel(labelId, taskId);
    return { content: [{ type: 'text', text: JSON.stringify({ success: true, labelId, taskId }, null, 2) }] };
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
    }),
  },
  async ({ labelId, taskId }) => {
    const client = getClient();
    await client.detachLabel(labelId, taskId);
    return { content: [{ type: 'text', text: JSON.stringify({ success: true, labelId, taskId }, null, 2) }] };
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
    }),
  },
  async ({ taskId, comment }) => {
    const client = getClient();
    const result = await client.addComment(taskId, comment);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  'kaneo_list_comments',
  {
    title: 'List Comments',
    description: 'List all comments on a Kaneo task',
    inputSchema: z.object({
      taskId: z.string().describe('Task ID'),
    }),
  },
  async ({ taskId }) => {
    const client = getClient();
    const comments = await client.listComments(taskId);
    return { content: [{ type: 'text', text: JSON.stringify(comments, null, 2) }] };
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
    }),
  },
  async ({ query, type, workspaceId, projectId, limit }) => {
    const client = getClient();
    const results = await client.search(query, { type, workspaceId, projectId, limit });
    return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
