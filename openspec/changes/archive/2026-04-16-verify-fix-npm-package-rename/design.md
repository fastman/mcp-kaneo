## Context

The package `@fastman/mcp-kaneo` was renamed from `mcp-kaneo`. The package.json already has the correct name, but package-lock.json and README.md still reference the old name. This change verifies and fixes the remaining files.

## Goals / Non-Goals

**Goals:**
- Regenerate package-lock.json with correct package name
- Update README.md all installation examples to use @fastman/mcp-kaneo
- Verify server.json is consistent

**Non-Goals:**
- No code changes required
- No breaking changes to API or functionality
- No changes to bin field (follows npm convention)

## Decisions

1. **Keep bin name as `mcp-kaneo`**
   - Rationale: Scoped packages conventionally use just the package name (without @scope/) for the bin field. Verified against @modelcontextprotocol/server-brave-search, @eventcatalog/mcp-server, and other MCP packages.

2. **Keep server.json identifier as `mcp-kaneo`**
   - Rationale: The identifier is the executable name which resolves correctly with both `npx mcp-kaneo` and `npx @fastman/mcp-kaneo`.

3. **Update README.md with scoped package name**
   - Rationale: Users should use the new `@fastman/mcp-kaneo` for installation commands.

## Risks / Trade-offs

- **Risk**: Old documentation references may confuse users
  - **Mitigation**: This change updates all examples to use the new package name

- **Risk**: package-lock.json regeneration may cause CI differences
  - **Mitigation**: Expected - lock file changes are normal and should be committed
