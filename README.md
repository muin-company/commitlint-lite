# commitlint-lite

> Lightweight commit message linter. Conventional Commits validation with zero dependencies.

[![npm version](https://img.shields.io/npm/v/commitlint-lite.svg)](https://www.npmjs.com/package/commitlint-lite)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

## Why commitlint-lite?

- **Zero dependencies** — No bloat, just pure Node.js
- **Fast** — Instant validation with minimal overhead
- **Simple** — One job, done well
- **Standard** — Follows [Conventional Commits](https://www.conventionalcommits.org/) specification

Perfect for projects that want commit message validation without the heavyweight tooling.

## Installation

```bash
npm install -D commitlint-lite
```

Or use directly with npx:

```bash
npx commitlint-lite "feat: add login"
```

## Usage

### Command Line

```bash
# Validate a commit message
commitlint-lite "feat: add login feature"

# Read from stdin (useful for git hooks)
echo "fix(auth): resolve token issue" | commitlint-lite --stdin

# Install git hook automatically
commitlint-lite --init-hook

# JSON output
commitlint-lite "feat: new feature" --json
```

### Git Hook Setup

The easiest way:

```bash
commitlint-lite --init-hook
```

This creates `.git/hooks/commit-msg` automatically.

Manual setup (`.git/hooks/commit-msg`):

```bash
#!/usr/bin/env sh
MESSAGE_FILE="$1"
MESSAGE=$(cat "$MESSAGE_FILE")

npx commitlint-lite --stdin <<EOF
$MESSAGE
EOF
```

Make it executable:

```bash
chmod +x .git/hooks/commit-msg
```

## Configuration

Create `.commitlintrc.json` in your project root:

```json
{
  "types": ["feat", "fix", "docs", "style", "refactor", "test", "chore"],
  "maxLength": 72,
  "requireScope": false
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `types` | `string[]` | `["feat", "fix", "docs", "style", "refactor", "test", "chore", "ci", "perf", "build", "revert"]` | Allowed commit types |
| `maxLength` | `number` | `100` | Maximum commit message length |
| `requireScope` | `boolean` | `false` | Whether scope is required |

## Conventional Commits Format

```
type(scope): description

Examples:
✓ feat: add user authentication
✓ fix(api): resolve timeout issue
✓ docs: update installation guide
✗ added new stuff (invalid)
```

### Default Types

- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation changes
- `style` — Code style changes (formatting, etc.)
- `refactor` — Code refactoring
- `test` — Adding or updating tests
- `chore` — Maintenance tasks
- `ci` — CI/CD changes
- `perf` — Performance improvements
- `build` — Build system changes
- `revert` — Revert previous commit

## Examples

### Example 1: Valid commits (various formats)

```bash
$ commitlint-lite "feat: add login feature"
✓ Commit message is valid

$ commitlint-lite "fix(auth): resolve token expiration"
✓ Commit message is valid

$ commitlint-lite "docs: update README"
✓ Commit message is valid

$ commitlint-lite "feat!: breaking API change"
✓ Commit message is valid (breaking change marker)
```

All exit with code 0.

### Example 2: Invalid format

```bash
$ commitlint-lite "added new stuff"
✗ Commit message validation failed:
  • Invalid commit message format. Expected: type(scope): description
  
$ commitlint-lite "Update README"
✗ Commit message validation failed:
  • Invalid commit message format. Expected: type(scope): description
  • Must start with a valid type (feat, fix, docs, etc.)
```

Exit code: 1 (blocks commit in git hook)

### Example 3: Invalid type

```bash
$ commitlint-lite "invalid: test feature"
✗ Commit message validation failed:
  • Invalid commit type "invalid". Allowed types: feat, fix, docs, style, refactor, test, chore, ci, perf, build, revert

$ commitlint-lite "feature: add login"
✗ Commit message validation failed:
  • Invalid commit type "feature". Did you mean "feat"?
```

Catches typos and enforces standard types.

### Example 4: Length violation

```bash
$ commitlint-lite "feat: add comprehensive user authentication system with OAuth2, JWT tokens, refresh mechanism, and role-based access control for enterprise users"
✗ Commit message validation failed:
  • Commit message exceeds maximum length (148 > 100 characters)
  • Consider shortening: "feat: add user authentication with OAuth2 and RBAC"
```

Enforces concise commit messages.

### Example 5: Git hook in action

After running `commitlint-lite --init-hook`:

```bash
$ git commit -m "added stuff"
✗ Commit message validation failed:
  • Invalid commit message format. Expected: type(scope): description

Commit aborted.

$ git commit -m "feat: add user dashboard"
✓ Commit message is valid
[main abc123d] feat: add user dashboard
 1 file changed, 50 insertions(+)
```

Catches bad commits before they enter history.

### Example 6: Multi-line commit with body

```bash
$ commitlint-lite "feat(api): add user endpoints

Implemented CRUD operations for user management:
- GET /api/users
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id"

✓ Commit message is valid
```

Only the first line is validated; body is preserved.

### Example 7: Required scope configuration

With `.commitlintrc.json`:
```json
{
  "requireScope": true,
  "types": ["feat", "fix", "docs"]
}
```

```bash
$ commitlint-lite "feat: add login"
✗ Commit message validation failed:
  • Scope is required. Use format: type(scope): description

$ commitlint-lite "feat(auth): add login"
✓ Commit message is valid
```

Enforces scope for better categorization.

## Programmatic Usage

```typescript
import { parseCommitMessage, validateCommit, loadConfig } from 'commitlint-lite';

const message = 'feat(auth): add login';
const parsed = parseCommitMessage(message);
const config = loadConfig();
const result = validateCommit(parsed, config);

if (result.valid) {
  console.log('Valid commit!');
} else {
  console.error('Errors:', result.errors);
}
```

## Why Zero Dependencies?

Most commit linting tools pull in dozens of dependencies, adding bloat and potential security risks. commitlint-lite uses only Node.js built-in modules, making it:

- Faster to install
- Faster to run
- Easier to audit
- More reliable long-term

## Comparison

| Tool | Dependencies | Install Size | Speed |
|------|--------------|--------------|-------|
| commitlint-lite | 0 | ~20KB | ⚡️ Instant |
| @commitlint/cli | 170+ | ~15MB | 🐢 Slow |

## License

MIT © MUIN

## Contributing

Issues and pull requests welcome! Visit [GitHub](https://github.com/muin-company/commitlint-lite).
