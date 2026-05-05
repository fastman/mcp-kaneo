## ADDED Requirements

### Requirement: package-lock.json reflects new package name
The package-lock.json SHALL contain `@fastman/mcp-kaneo` as the package name instead of the old `mcp-kaneo`.

#### Scenario: package-lock.json has correct name
- **WHEN** npm install is run
- **THEN** package-lock.json shows `"name": "@fastman/mcp-kaneo"`

### Requirement: README.md installation examples use scoped package
The README.md SHALL show `@fastman/mcp-kaneo` in all installation examples, including npx, npm install -g, and configuration JSON examples.

#### Scenario: npx command updated
- **WHEN** User reads README.md npx example
- **THEN** Command shows `npx @fastman/mcp-kaneo`

#### Scenario: npm install -g command updated
- **WHEN** User reads README.md npm install example
- **THEN** Command shows `npm install -g @fastman/mcp-kaneo`

#### Scenario: OpenCode configuration updated
- **WHEN** User reads OpenCode MCP configuration example
- **THEN** Command array shows `"npx", "-y", "@fastman/mcp-kaneo"`

#### Scenario: Claude Code configuration updated
- **WHEN** User reads Claude Code example
- **THEN** Command shows `npx @fastman/mcp-kaneo`

#### Scenario: Cline configuration updated
- **WHEN** User reads Cline MCP settings example
- **THEN** args shows `["-y", "@fastman/mcp-kaneo"]`

#### Scenario: Cursor configuration updated
- **WHEN** User reads Cursor MCP settings example
- **THEN** args shows `["-y", "@fastman/mcp-kaneo"]`

### Requirement: package.json maintains correct bin name
The package.json bin field SHALL remain as `mcp-kaneo` to follow npm scoped package convention.

#### Scenario: bin field unchanged
- **WHEN** User checks package.json bin field
- **THEN** It shows `"mcp-kaneo": "dist/index.js"`

### Requirement: server.json identifier unchanged
The server.json identifier SHALL remain as `mcp-kaneo` as it represents the executable name.

#### Scenario: server.json identifier unchanged
- **WHEN** User checks server.json packages identifier
- **THEN** It shows `"identifier": "mcp-kaneo"`
