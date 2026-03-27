# MCP Kaneo

MCP server for Kaneo task management API.

## Requirements

- Node.js 18+

## Installation

```bash
npm install
npm run build
```

## Configuration

Set environment variables:

```bash
export KANEO_BASE_URL=https://your-kaneo-instance.com/api
export KANEO_TOKEN=your-bearer-token
```

Note: `KANEO_BASE_URL` should include the `/api` suffix.

## Usage

### Local Development

```bash
npm run dev
```

### Run with npx

```bash
npx mcp-kaneo
```

## OpenCode Configuration

Add to your `opencode.json`:

```json
{
  "mcp": {
    "kaneo": {
      "type": "local",
      "command": ["npx", "-y", "mcp-kaneo"],
      "environment": {
        "KANEO_BASE_URL": "{env:KANEO_BASE_URL}",
        "KANEO_TOKEN": "{env:KANEO_TOKEN}"
      }
    }
  }
}
```

## Available Tools

### Tasks

| Tool | Description |
|------|-------------|
| `kaneo_list_workspaces` | List all accessible workspaces |
| `kaneo_list_projects` | List projects in a workspace |
| `kaneo_get_task` | Get task details by ID |
| `kaneo_create_task` | Create a new task |
| `kaneo_update_task_title` | Update task title |
| `kaneo_update_task_description` | Update task description |
| `kaneo_update_task_status` | Move task to different column |
| `kaneo_delete_task` | Delete a task |

### Labels

| Tool | Description |
|------|-------------|
| `kaneo_list_labels` | List workspace labels |
| `kaneo_create_label` | Create a new label |
| `kaneo_attach_label` | Attach label to task |
| `kaneo_detach_label` | Detach label from task |

### Comments & Search

| Tool | Description |
|------|-------------|
| `kaneo_add_comment` | Add comment to task |
| `kaneo_list_comments` | List task comments |
| `kaneo_search` | Search tasks/projects/comments |

## License

MIT
