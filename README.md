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

### Valid Commits

```bash
commitlint-lite "feat: add login feature"
# ✓ Commit message is valid

commitlint-lite "fix(auth): resolve token expiration"
# ✓ Commit message is valid

commitlint-lite "docs: update README"
# ✓ Commit message is valid
```

### Invalid Commits

```bash
commitlint-lite "added new stuff"
# ✗ Commit message validation failed:
#   • Invalid commit message format. Expected: type(scope): description

commitlint-lite "invalid: test"
# ✗ Commit message validation failed:
#   • Invalid commit type "invalid". Allowed types: feat, fix, docs, ...

commitlint-lite "feat:"
# ✗ Commit message validation failed:
#   • Commit description is required
```

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
