## Context

The mcp-kaneo project is an MCP server for Kaneo task management API. Currently, it has basic documentation (README.md) but lacks Claude Code plugin integration and MCP Registry listing. The goal is to follow chrome-devtools-mcp pattern to improve discoverability and ease of use across different AI coding assistants.

## Goals / Non-Goals

**Goals:**
- Create `.claude-plugin/` folder with proper plugin.json for Claude Code integration
- Create marketplace.json for plugin marketplace metadata
- Create server.json for MCP Registry discoverability

**Non-Goals:**
- Modify existing MCP server code
- Add new MCP tools
- Update README.md (already comprehensive)
- Create CONTRIBUTING.md, SECURITY.md, CHANGELOG.md (optional, not required)

## Decisions

1. **Plugin format**: Using chrome-devtools-mcp's `.claude-plugin/` structure (plugin.json + marketplace.json) rather than just plugin.json - enables both MCP and skill integration in Claude Code.

2. **Version alignment**: Using package.json version (0.1.0) for consistency across all new files.

3. **NPM package identifier**: Using `@fastman/mcp-kaneo` (matching the npm package) for the MCP server command.

4. **Environment variables**: Including `KANEO_BASE_URL` and `KANEO_TOKEN` in server.json as required variables.

## Risks / Trade-offs

- [Risk] Version mismatch → Mitigation: Keep versions synchronized during releases
- [Risk] NPM package name change → Mitigation: Update all config files when/if package name changes