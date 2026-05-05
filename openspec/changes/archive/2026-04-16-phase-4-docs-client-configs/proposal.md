## Why

The mcp-kaneo MCP server needs proper documentation and client configuration files to improve discoverability, installation ease, and Claude Code plugin integration. Following the chrome-devtools-mcp pattern will make the project more accessible to users of various AI coding assistants (OpenCode, Claude Code, Cline, Cursor).

## What Changes

- Create `.claude-plugin/` folder with plugin.json for Claude Code integration
- Create `.claude-plugin/marketplace.json` for plugin marketplace metadata
- Create `server.json` for MCP Registry discoverability

## Capabilities

### New Capabilities

- **claude-plugin-integration**: Add Claude Code plugin support via `.claude-plugin/` folder
- **mcp-registry-listing**: Add MCP Registry metadata for server discoverability

### Modified Capabilities

- (none - existing README.md is already comprehensive)

## Impact

- New files: `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `server.json`
- Affected systems: Claude Code plugin system, MCP Registry