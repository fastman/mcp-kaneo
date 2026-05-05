## Why

The Kaneo MCP server currently lacks the ability to retrieve, update, or delete individual workspaces. Users can only list all workspaces via `kaneo_list_workspaces`, but there's no way to get a specific workspace, filter by workspaceId, or manage workspace lifecycle operations. This limits the MCP's utility for multi-workspace users who need fine-grained workspace management.

## What Changes

- Add `kaneo_get_workspace` tool to retrieve a single workspace by ID
- Add `kaneo_update_workspace` tool to update workspace name, slug, or logo
- Add `kaneo_delete_workspace` tool to delete a workspace
- Expose `workspaceId` as optional filter parameter in `kaneo_list_workspaces`

## Capabilities

### New Capabilities
- `workspace-management`: Full CRUD operations for workspaces (get, update, delete, list with filter)

### Modified Capabilities
- (none - existing listWorkspaces behavior is unchanged, just adding optional filter)

## Impact

- **client.ts**: Add `getWorkspace`, `updateWorkspace`, `deleteWorkspace` methods
- **index.ts**: Register 3 new MCP tools plus workspaceId optional param
- **types.ts**: May need WorkspaceUpdateInput type