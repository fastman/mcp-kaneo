## ADDED Requirements

### Requirement: Claude Code plugin integration
The system SHALL provide a `.claude-plugin/` folder containing plugin.json for MCP server integration with Claude Code.

#### Scenario: Plugin installation via marketplace
- **WHEN** user runs `/plugin marketplace add fastman/mcp-kaneo` in Claude Code
- **THEN** Claude Code downloads and configures the MCP server from the repository

#### Scenario: MCP server command configuration
- **WHEN** Claude Code loads the plugin
- **THEN** it SHALL configure the MCP server using the command "npx" with arguments ["@fastman/mcp-kaneo"]

### Requirement: Marketplace metadata
The system SHALL provide a marketplace.json file with plugin metadata for the Claude Code plugin marketplace.

#### Scenario: Repository discovery
- **WHEN** Plugin is submitted to marketplace
- **THEN** The marketplace.json SHALL contain repository URL and owner information

### Requirement: Plugin version tracking
The system SHALL include version information in plugin.json that matches the NPM package version.

#### Scenario: Version alignment
- **WHEN** Package is published to NPM
- **THEN** The plugin.json version SHALL be updated to match