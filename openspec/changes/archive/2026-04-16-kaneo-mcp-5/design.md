## Context

The Kaneo MCP server provides task management capabilities via MCP tools. Currently, it supports listing all workspaces but lacks individual workspace CRUD operations. This design extends the MCP to add workspace management capabilities.

### Current State
- `kaneo_list_workspaces` returns all accessible workspaces
- No way to get, update, or delete individual workspaces
- No filtering on workspace list

### Constraints
- Must follow existing client.ts patterns for HTTP requests
- Must use existing authentication via KANEO_TOKEN
- No breaking changes to existing tool signatures (workspaceId optional param only)

## Goals / Non-Goals

**Goals:**
- Add get/update/delete workspace MCP tools
- Add optional workspaceId filter to listWorkspaces
- Follow existing code patterns and conventions

**Non-Goals:**
- Implement workspace member management (separate capability)
- Add workspace analytics/statistics
- Support workspace templates

## Decisions

### D1: Reuse existing request pattern
**Decision**: Use the same HTTP request pattern as existing client methods.

**Rationale**: The client.ts already has a solid request wrapper with auth headers. Adding new methods follows the same pattern for consistency.

**Alternatives Considered**:
- Create new HTTP abstraction: Rejected - would increase code complexity

### D2: Extend listWorkspaces vs new tool
**Decision**: Add workspaceId as optional parameter to existing `kaneo_list_workspaces` instead of creating `kaneo_get_workspace` as separate endpoint.

**Rationale**: The API likely supports filtering by workspaceId on the same endpoint, keeping the tool surface smaller.

**Alternatives Considered**:
- Separate `kaneo_get_workspace` tool: Rejected - API may not have dedicated endpoint

### D3: Update method accepts partial data
**Decision**: `updateWorkspace` accepts partial update data (name, slug, logo optional).

**Rationale**: Matches existing `updateProject` pattern in the codebase.

## Risks / Trade-offs

[R1] API may not support some operations
→ **Mitigation**: Test each operation; if unsupported, document in tool description

[R2] Slug uniqueness
→ **Mitigation**: API should enforce; handle conflict error gracefully

[R3] No rollback for deleted workspace
→ **Mitigation**: API may support archive rather than hard delete (document behavior)

## Migration Plan

1. Add client methods first (getWorkspace, updateWorkspace, deleteWorkspace)
2. Register new MCP tools in index.ts
3. Add workspaceId optional param to existing list_workspaces tool
4. Test each tool with API

## Open Questions

- Q1: Does DELETE perform hard delete or soft delete/archive?
- Q2: What error format does API return for not found vs unauthorized?
- Q3: Is there a rate limit to consider?