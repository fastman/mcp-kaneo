## ADDED Requirements

### Requirement: MCP Registry listing
The system SHALL provide a server.json file for MCP Registry (modelcontextprotocol.io) discoverability.

#### Scenario: Server discovery
- **WHEN** User browses MCP Registry
- **THEN** The mcp-kaneo server SHALL appear in search results with proper metadata

#### Scenario: Package information
- **WHEN** Registry parses server.json
- **THEN** It SHALL include name "io.github.fastman/mcp-kaneo", title "Kaneo MCP", and description

#### Scenario: Installation command
- **WHEN** User clicks install on MCP Registry
- **THEN** The system SHALL provide stdio transport with npm package "@fastman/mcp-kaneo"

### Requirement: Environment variables documentation
The server.json SHALL document required environment variables for MCP clients.

#### Scenario: Client configuration
- **WHEN** User configures MCP client using Registry info
- **THEN** They SHALL know KANEO_BASE_URL and KANEO_TOKEN are required

### Requirement: Repository linking
The server.json SHALL link to the GitHub repository for source code access.

#### Scenario: Source verification
- **WHEN** User views server on Registry
- **THEN** They can access the repository URL for issues and contributions