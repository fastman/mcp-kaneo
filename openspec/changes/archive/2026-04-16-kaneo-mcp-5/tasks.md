## 1. Client Implementation

- [x] 1.1 Add getWorkspace method to client.ts
- [x] 1.2 Add updateWorkspace method to client.ts
- [x] 1.3 Add deleteWorkspace method to client.ts
- [x] 1.4 Update listWorkspaces to accept optional workspaceId parameter

## 2. MCP Tool Registration

- [x] 2.1 Register kaneo_get_workspace tool in index.ts
- [x] 2.2 Register kaneo_update_workspace tool in index.ts
- [x] 2.3 Register kaneo_delete_workspace tool in index.ts
- [x] 2.4 Add workspaceId optional param to kaneo_list_workspaces tool

## 3. Testing

- [x] 3.1 Verify getWorkspace with valid workspaceId
- [x] 3.2 Verify getWorkspace with invalid workspaceId (error case)
- [x] 3.3 Verify updateWorkspace with valid data
- [x] 3.4 Verify updateWorkspace slug conflict (error case)
- [x] 3.5 Verify deleteWorkspace
- [x] 3.6 Verify listWorkspaces returns all workspaces
- [x] 3.7 Verify listWorkspaces with workspaceId filter

## 4. Unit Tests (if applicable)

- [x] 4.1 Add unit tests for client methods in tests/client.test.ts
- [x] 4.2 Mock API responses for error handling tests