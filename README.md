# mcp-kaneo

MCP server for Kaneo task management API. Lets your AI coding assistant manage tasks, projects, labels, and comments in Kaneo.

## Features

- **Tasks**: Create, read, update, delete tasks
- **Projects**: List and manage projects
- **Labels**: Create, update, delete labels; attach/detach from tasks
- **Comments**: Add and list comments on tasks
- **Search**: Search tasks, projects, and workspaces
- **Workspaces**: List workspaces and organizations

## Requirements

- [Node.js](https://nodejs.org/) v18 or later
- [Kaneo](https://kaneo.app/) account with API access

## Installation

### Using npx (recommended)

```bash
npx @fastman/mcp-kaneo
```

### Using npm

```bash
npm install -g @fastman/mcp-kaneo
npx @fastman/mcp-kaneo
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `KANEO_BASE_URL` | Yes | Kaneo API URL (e.g., `https://your-kaneo-instance.com/api`) |
| `KANEO_TOKEN` | Yes | Kaneo API token |

### OpenCode

Add to your `~/.config/opencode/opencode.json`:

```json
{
  "mcp": {
    "kaneo": {
      "type": "local",
      "command": ["npx", "-y", "@fastman/mcp-kaneo"],
      "environment": {
        "KANEO_BASE_URL": "https://your-kaneo-instance.com/api",
        "KANEO_TOKEN": "${KANEO_TOKEN}"
      }
    }
  }
}
```

Or for local development:

```json
{
  "mcp": {
    "kaneo": {
      "type": "local",
      "command": ["node", "/path/to/mcp-kaneo/dist/index.js"],
      "environment": {
        "KANEO_BASE_URL": "https://your-kaneo-instance.com/api",
        "KANEO_TOKEN": "your-token"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add kaneo --scope user npx @fastman/mcp-kaneo
```

### Cline

Add to your MCP settings:

```json
{
  "mcpServers": {
    "kaneo": {
      "command": "npx",
      "args": ["-y", "@fastman/mcp-kaneo"]
    }
  }
}
```

### Cursor

Go to `Cursor Settings` → `MCP` → `New MCP Server`:

```json
{
  "command": "npx",
  "args": ["-y", "@fastman/mcp-kaneo"]
}
```

## Tools

### Workspaces

- `kaneo_list_workspaces` - List all accessible workspaces

### Projects

- `kaneo_list_projects` - List projects in a workspace
- `kaneo_get_project` - Get project details
- `kaneo_create_project` - Create a new project

### Tasks

- `kaneo_create_task` - Create a new task
- `kaneo_get_task` - Get task details
- `kaneo_update_task_title` - Update task title
- `kaneo_update_task_description` - Update task description
- `kaneo_update_task_status` - Update task status (move between columns)
- `kaneo_update_task_priority` - Update task priority
- `kaneo_update_task_assignee` - Update task assignee
- `kaneo_update_task_due_date` - Update task due date
- `kaneo_delete_task` - Delete a task
- `kaneo_list_tasks` - List tasks in a project

### Labels

- `kaneo_list_labels` - List workspace labels
- `kaneo_create_label` - Create a new label
- `kaneo_update_label` - Update label name/color
- `kaneo_delete_label` - Delete a label
- `kaneo_attach_label` - Attach label to task
- `kaneo_detach_label` - Detach label from task
- `kaneo_list_task_labels` - List labels on a task

### Comments

- `kaneo_add_comment` - Add comment to task
- `kaneo_list_comments` - List comments on task

### Search

- `kaneo_search` - Search tasks, projects, workspaces

## Usage Examples

### Create a task

```
Create a task in kaneo called "Fix login bug" with high priority
```

### List tasks

```
List my kaneo tasks in the "Kaneo MCP" project
```

### Add a label

```
Create a label called "bug" with color #ef4444 and attach it to the task
```

### Update task status

```
Move the task "Fix login bug" to in-progress
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Run locally
npm start
```

## License

MIT
