## Why

The npm package was previously published as `mcp-kaneo` but is now being renamed to `@fastman/mcp-kaneo` to follow npm scoped package conventions. Verification and documentation updates are needed to ensure consistency across all package files and installation instructions.

## What Changes

- Regenerate `package-lock.json` with the new scoped package name
- Update `README.md` installation examples to use `@fastman/mcp-kaneo`
- Verify all package files are consistent with the new package name
- Keep `bin` field as `mcp-kaneo` (follows convention for scoped packages)
- Keep `server.json` identifier as `mcp-kaneo` (executable name)

## Capabilities

### New Capabilities

- `npm-package-rename-verification`: Verify all package files reflect the new `@fastman/mcp-kaneo` name

### Modified Capabilities

- None - this is a documentation and consistency fix, not a capability change

## Impact

- `package.json` - Already correct (`@fastman/mcp-kaneo`)
- `package-lock.json` - Needs regeneration
- `server.json` - Already correct (uses `io.github.fastman/mcp-kaneo`)
- `README.md` - Needs update to show `@fastman/mcp-kaneo` in all examples
