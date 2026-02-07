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

## Basic Examples

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

### Example 8: Breaking changes

```bash
$ commitlint-lite "feat!: remove legacy API"
✓ Commit message is valid

$ commitlint-lite "feat(api)!: change authentication flow

BREAKING CHANGE: OAuth2 is now required for all endpoints"
✓ Commit message is valid

# Both formats are valid for breaking changes:
# - type!: description
# - type(scope)!: description
# - Body contains "BREAKING CHANGE:"
```

### Example 9: JSON output for automation

```bash
$ commitlint-lite "feat: add login" --json
{
  "valid": true,
  "type": "feat",
  "scope": null,
  "description": "add login",
  "errors": []
}

$ commitlint-lite "invalid message" --json
{
  "valid": false,
  "type": null,
  "scope": null,
  "description": null,
  "errors": [
    "Invalid commit message format. Expected: type(scope): description"
  ]
}
```

Use in scripts:

```bash
#!/bin/bash
RESULT=$(commitlint-lite "feat: test" --json)
IS_VALID=$(echo $RESULT | jq '.valid')

if [ "$IS_VALID" == "true" ]; then
  echo "Valid commit message"
else
  echo "Invalid: $(echo $RESULT | jq -r '.errors[]')"
  exit 1
fi
```

### Example 10: Team-specific types

Configure custom types for your team's workflow:

```json
{
  "types": [
    "feat",
    "fix",
    "docs",
    "style",
    "refactor",
    "test",
    "chore",
    "hotfix",
    "release",
    "wip"
  ],
  "maxLength": 72,
  "requireScope": true
}
```

```bash
$ commitlint-lite "hotfix(billing): fix payment processing"
✓ Commit message is valid

$ commitlint-lite "wip(ui): work in progress on new design"
✓ Commit message is valid

$ commitlint-lite "release: v2.0.0"
✗ Commit message validation failed:
  • Scope is required. Use format: type(scope): description

$ commitlint-lite "release(v2.0.0): major version bump"
✓ Commit message is valid
```

## Integration Guides

### CI/CD Integration

#### GitHub Actions

**Basic validation:**

```yaml
# .github/workflows/commitlint.yml
name: Lint Commit Messages

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  commitlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Get full history for PR commits
      
      - name: Validate PR title
        run: npx commitlint-lite "${{ github.event.pull_request.title }}"
      
      - name: Validate all commits in PR
        run: |
          git log --format=%s origin/${{ github.base_ref }}..HEAD | while read msg; do
            echo "Checking: $msg"
            npx commitlint-lite "$msg"
          done
```

**With detailed feedback:**

```yaml
name: Commit Linting

on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Check commits
        id: commitlint
        run: |
          ERRORS=""
          git log --format=%s origin/main..HEAD | while read msg; do
            RESULT=$(npx commitlint-lite "$msg" --json)
            VALID=$(echo $RESULT | jq -r '.valid')
            
            if [ "$VALID" == "false" ]; then
              ERRORS="$ERRORS\n❌ $msg"
              echo "$RESULT" | jq -r '.errors[]' | sed 's/^/  /'
            fi
          done
          
          if [ ! -z "$ERRORS" ]; then
            echo "::error::Invalid commit messages found"
            exit 1
          fi
      
      - name: Comment on PR
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## ❌ Commit Message Validation Failed
              
              Please follow [Conventional Commits](https://www.conventionalcommits.org/) format:
              
              \`\`\`
              type(scope): description
              \`\`\`
              
              **Valid types:** feat, fix, docs, style, refactor, test, chore, ci, perf, build, revert
              
              **Examples:**
              - \`feat: add user authentication\`
              - \`fix(api): resolve timeout issue\`
              - \`docs: update installation guide\`
              `
            });
```

**Enforce on merge:**

```yaml
name: Enforce Conventional Commits

on:
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  validate-pr-title:
    runs-on: ubuntu-latest
    steps:
      - name: Validate PR title
        run: |
          npx commitlint-lite "${{ github.event.pull_request.title }}" || {
            echo "❌ PR title must follow Conventional Commits format"
            echo "Example: feat: add new feature"
            exit 1
          }
```

#### GitLab CI

```yaml
# .gitlab-ci.yml
commitlint:
  stage: validate
  script:
    - |
      git log --format=%s origin/main..$CI_COMMIT_SHA | while read msg; do
        echo "Validating: $msg"
        npx commitlint-lite "$msg" || exit 1
      done
  only:
    - merge_requests
```

#### CircleCI

```yaml
# .circleci/config.yml
version: 2.1

jobs:
  commitlint:
    docker:
      - image: node:18
    steps:
      - checkout
      - run:
          name: Validate commits
          command: |
            git log --format=%s origin/main..HEAD | while read msg; do
              npx commitlint-lite "$msg"
            done

workflows:
  validate:
    jobs:
      - commitlint
```

#### Jenkins

```groovy
// Jenkinsfile
pipeline {
  agent any
  
  stages {
    stage('Lint Commits') {
      steps {
        script {
          def commits = sh(
            script: "git log --format=%s origin/main..HEAD",
            returnStdout: true
          ).trim().split('\n')
          
          commits.each { msg ->
            def result = sh(
              script: "npx commitlint-lite '${msg}' --json",
              returnStdout: true
            )
            
            def json = readJSON text: result
            if (!json.valid) {
              error("Invalid commit: ${msg}")
            }
          }
        }
      }
    }
  }
}
```

### Pre-commit Hooks

#### Using Husky

```bash
# Install Husky
npm install --save-dev husky

# Initialize
npx husky install

# Add commit-msg hook
npx husky add .husky/commit-msg 'npx commitlint-lite --stdin < "$1"'
```

Or create `.husky/commit-msg` manually:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Read commit message
MESSAGE=$(cat "$1")

# Validate
npx commitlint-lite "$MESSAGE" || {
  echo ""
  echo "❌ Commit message does not follow Conventional Commits format"
  echo ""
  echo "Format: type(scope): description"
  echo ""
  echo "Examples:"
  echo "  feat: add new feature"
  echo "  fix(api): resolve bug"
  echo "  docs: update README"
  echo ""
  echo "Valid types: feat, fix, docs, style, refactor, test, chore"
  exit 1
}
```

Make it executable:

```bash
chmod +x .husky/commit-msg
```

#### Manual Git Hook

```bash
#!/usr/bin/env sh
# .git/hooks/commit-msg

MESSAGE_FILE="$1"
MESSAGE=$(cat "$MESSAGE_FILE")

# Validate commit message
npx commitlint-lite "$MESSAGE" 2>&1 | tee /tmp/commitlint-error.log

if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo ""
  echo "💡 Tips:"
  echo "  - Use present tense: 'add feature' not 'added feature'"
  echo "  - Keep it short: max 72 characters for first line"
  echo "  - Use scope to specify affected area: 'fix(auth): ...'"
  echo ""
  echo "To skip this check (not recommended):"
  echo "  git commit --no-verify"
  exit 1
fi
```

#### Using lint-staged

Combine with lint-staged for comprehensive pre-commit checks:

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"],
    "*": "commitlint-lite"
  }
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "commit": "git-cz",
    "commitlint": "commitlint-lite",
    "commitlint:last": "git log -1 --pretty=%B | commitlint-lite --stdin",
    "commitlint:all": "git log --format=%s | commitlint-lite --stdin",
    "commitlint:pr": "git log origin/main..HEAD --format=%s | commitlint-lite --stdin",
    "prepare": "husky install",
    "release": "npm run commitlint:all && standard-version"
  }
}
```

**Usage:**

```bash
# Validate last commit
npm run commitlint:last

# Validate all commits in branch
npm run commitlint:pr

# Before release, ensure all commits are valid
npm run release
```

### Interactive Commit Tool

Create a helper script for guided commits:

```bash
#!/bin/bash
# scripts/commit.sh

echo "🎯 Guided Commit"
echo ""

# Select type
echo "Select commit type:"
select TYPE in feat fix docs style refactor test chore ci perf build; do
  break
done

# Get scope (optional)
read -p "Scope (optional, press Enter to skip): " SCOPE

# Get description
read -p "Description: " DESC

# Build commit message
if [ -z "$SCOPE" ]; then
  MSG="$TYPE: $DESC"
else
  MSG="$TYPE($SCOPE): $DESC"
fi

# Validate
echo ""
echo "Commit message: $MSG"
npx commitlint-lite "$MSG"

if [ $? -eq 0 ]; then
  echo ""
  read -p "Proceed with commit? (y/N): " CONFIRM
  if [ "$CONFIRM" == "y" ]; then
    git commit -m "$MSG"
  fi
else
  echo "❌ Invalid commit message. Please try again."
  exit 1
fi
```

Add to package.json:

```json
{
  "scripts": {
    "commit": "bash scripts/commit.sh"
  }
}
```

Use: `npm run commit`

### Monorepo Integration

**Lerna:**

```json
// lerna.json
{
  "command": {
    "version": {
      "conventionalCommits": true,
      "message": "chore(release): publish %s",
      "allowBranch": "main"
    }
  }
}
```

Validate all commits:

```bash
lerna exec -- commitlint-lite --all
```

**Nx:**

```json
// workspace.json
{
  "tasksRunnerOptions": {
    "default": {
      "options": {
        "commitPrefix": "[{project}]"
      }
    }
  }
}
```

Validate with project prefix:

```bash
# Commit format: feat(api): description
commitlint-lite "feat(api): add endpoint"
```

## Framework-Specific Examples

### React / Next.js Projects

Common commit types for React projects:

```json
{
  "types": [
    "feat",      // New feature
    "fix",       // Bug fix
    "style",     // CSS/styling changes
    "refactor",  // Code refactoring
    "perf",      // Performance improvements
    "test",      // Tests
    "docs",      // Documentation
    "chore"      // Build/config changes
  ],
  "scopes": [
    "ui",        // UI components
    "api",       // API integration
    "auth",      // Authentication
    "routing",   // Routing/navigation
    "state",     // State management
    "build",     // Build configuration
    "deps"       // Dependencies
  ]
}
```

Example commits:

```bash
commitlint-lite "feat(ui): add responsive navbar"
commitlint-lite "fix(auth): resolve token refresh issue"
commitlint-lite "style(ui): improve button hover effects"
commitlint-lite "refactor(state): migrate to zustand"
commitlint-lite "perf(api): implement request caching"
```

### Vue / Nuxt Projects

```json
{
  "types": ["feat", "fix", "style", "refactor", "perf", "test", "docs", "chore"],
  "scopes": [
    "components",
    "composables",
    "pages",
    "layouts",
    "plugins",
    "middleware",
    "store"
  ]
}
```

### Backend (Node.js/Express)

```json
{
  "types": ["feat", "fix", "refactor", "perf", "test", "docs", "chore", "security"],
  "scopes": [
    "api",
    "auth",
    "db",
    "middleware",
    "routes",
    "validation",
    "logging"
  ]
}
```

Example commits:

```bash
commitlint-lite "feat(api): add user profile endpoints"
commitlint-lite "fix(db): resolve connection pool leak"
commitlint-lite "security(auth): add rate limiting"
commitlint-lite "perf(db): optimize query performance"
```

### Mobile (React Native)

```json
{
  "types": ["feat", "fix", "style", "refactor", "perf", "test", "docs", "chore"],
  "scopes": [
    "ios",
    "android",
    "navigation",
    "ui",
    "notifications",
    "storage"
  ]
}
```

### DevOps / Infrastructure

```json
{
  "types": ["feat", "fix", "chore", "ci", "build", "deploy"],
  "scopes": [
    "docker",
    "k8s",
    "terraform",
    "ansible",
    "ci",
    "monitoring"
  ]
}
```

Example commits:

```bash
commitlint-lite "ci(github): add automated testing workflow"
commitlint-lite "build(docker): optimize image size"
commitlint-lite "deploy(k8s): update ingress configuration"
```

## Troubleshooting

### Issue 1: Git hook not triggering

**Problem:** Commits are not being validated even after installing the hook.

**Cause:** Hook file not executable or Git hooks disabled.

**Solution:**

```bash
# Check if hook exists
ls -la .git/hooks/commit-msg

# Make it executable
chmod +x .git/hooks/commit-msg

# Test the hook
.git/hooks/commit-msg .git/COMMIT_EDITMSG

# Check if hooks are disabled
git config --get core.hooksPath
# Should be empty or .git/hooks

# If using Husky, ensure it's initialized
npx husky install
```

### Issue 2: Hook works locally but not in CI

**Problem:** Commits pass validation locally but fail in CI.

**Cause:** Different configurations or CI checking all commits in PR.

**Solution:**

```bash
# Local validation (last commit only)
git log -1 --pretty=%B | commitlint-lite --stdin

# CI validation (all commits in PR)
git log origin/main..HEAD --format=%s | commitlint-lite --stdin

# Align local and CI
{
  "scripts": {
    "commitlint:ci": "git log origin/main..HEAD --format=%s | while read msg; do commitlint-lite \"$msg\"; done"
  }
}
```

Test locally before pushing:

```bash
npm run commitlint:ci
```

### Issue 3: Breaking change format not recognized

**Problem:** Commits with breaking changes are not validated correctly.

**Cause:** Missing `!` or `BREAKING CHANGE:` in body.

**Solution:**

Valid breaking change formats:

```bash
# Option 1: Add ! after type
commitlint-lite "feat!: remove deprecated API"
✓ Valid

# Option 2: Add ! after scope
commitlint-lite "feat(api)!: change authentication"
✓ Valid

# Option 3: Include BREAKING CHANGE in body
commitlint-lite "feat: new auth system

BREAKING CHANGE: OAuth2 is now required"
✓ Valid
```

### Issue 4: Merge commit failing validation

**Problem:** Merge commits like "Merge branch 'feature' into main" fail validation.

**Cause:** Merge commits don't follow conventional format.

**Solution:**

```bash
# Skip validation for merge commits in hook
#!/usr/bin/env sh
# .git/hooks/commit-msg

MESSAGE=$(cat "$1")

# Skip merge commits
if echo "$MESSAGE" | grep -q "^Merge "; then
  exit 0
fi

# Validate other commits
npx commitlint-lite "$MESSAGE"
```

Or configure Git to use conventional merge messages:

```bash
git config --global merge.commitMessage "merge(branch): %s"
```

### Issue 5: Revert commits failing validation

**Problem:** `git revert` generates messages that fail validation.

**Cause:** Default revert message doesn't follow conventional format.

**Solution:**

Configure Git to use conventional revert format:

```bash
# .git/hooks/prepare-commit-msg
#!/usr/bin/env sh

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2

# If this is a revert commit
if [ "$COMMIT_SOURCE" = "revert" ]; then
  # Extract reverted commit message
  REVERTED_MSG=$(cat "$COMMIT_MSG_FILE" | grep "^Revert " | sed 's/^Revert "//' | sed 's/"$//')
  
  # Format as: revert: <original message>
  echo "revert: $REVERTED_MSG" > "$COMMIT_MSG_FILE"
fi
```

Or manually format:

```bash
# Instead of:
git revert abc123

# Use:
git revert abc123 --no-commit
git commit -m "revert(api): undo breaking change from abc123"
```

### Issue 6: Scope with special characters

**Problem:** Scopes with special characters (e.g., `feat(API/v2): ...`) fail validation.

**Cause:** Regex expects alphanumeric scopes.

**Solution:**

Use kebab-case for scopes:

```bash
# ❌ Bad
commitlint-lite "feat(API/v2): add endpoint"

# ✅ Good
commitlint-lite "feat(api-v2): add endpoint"
commitlint-lite "feat(api): add v2 endpoint"
```

Configure custom scope pattern (advanced):

```javascript
// commitlint.config.js
module.exports = {
  rules: {
    'scope-case': [2, 'always', ['lower-case', 'kebab-case']]
  }
};
```

### Issue 7: Long commit messages truncated

**Problem:** Detailed commit messages are rejected for length.

**Cause:** maxLength includes description but you need to add details.

**Solution:**

Use commit body for details:

```bash
# ❌ Bad - Everything in one line
git commit -m "feat(api): add user authentication with OAuth2, JWT tokens, refresh mechanism, and RBAC"

# ✅ Good - Short description + detailed body
git commit -m "feat(api): add user authentication" -m "
Implemented:
- OAuth2 integration
- JWT token generation
- Refresh token mechanism
- Role-based access control (RBAC)

Closes #123"
```

Configure longer maxLength if needed:

```json
{
  "maxLength": 120
}
```

### Issue 8: Team not following conventional commits

**Problem:** Team members keep committing with invalid messages.

**Cause:** Not familiar with format or forgetting.

**Solution:**

1. **Add commit template:**

```bash
# .gitmessage
# type(scope): subject
#
# type: feat, fix, docs, style, refactor, test, chore
# scope: component/module affected
# subject: short description (50 chars max)
#
# Examples:
# feat(auth): add login functionality
# fix(api): resolve timeout issue
# docs: update README

git config --local commit.template .gitmessage
```

2. **Use interactive commit tool:**

```bash
npm install -g commitizen cz-conventional-changelog

# Configure
echo '{"path": "cz-conventional-changelog"}' > .czrc

# Use
npm run commit  # or git cz
```

3. **Add CI feedback:**

```yaml
# Post helpful comment on invalid commits
- name: Comment on PR
  if: failure()
  run: |
    echo "See https://www.conventionalcommits.org/ for format guide"
```

### Issue 9: False positives with co-authored commits

**Problem:** Co-authored-by trailer causes validation to fail.

**Cause:** Validator checking entire message including trailers.

**Solution:**

Validator should only check first line:

```bash
# .git/hooks/commit-msg
#!/usr/bin/env sh

MESSAGE=$(cat "$1")
FIRST_LINE=$(echo "$MESSAGE" | head -n 1)

# Validate only first line
npx commitlint-lite "$FIRST_LINE"
```

Co-authored commits are fine:

```bash
git commit -m "feat(api): add new endpoint

Co-authored-by: Jane Doe <jane@example.com>
Co-authored-by: John Smith <john@example.com>"
```

### Issue 10: Emoji in commit messages

**Problem:** Team uses emoji but validation fails.

**Cause:** Emoji not part of conventional format.

**Solution:**

**Option 1:** Disable emoji (recommended for consistency)

```bash
# ❌ Don't use emoji
git commit -m "✨ feat: add feature"

# ✅ Use conventional format
git commit -m "feat: add feature"
```

**Option 2:** Allow emoji in description (configure):

```json
{
  "allowEmoji": true
}
```

```bash
# Emoji after description is OK
commitlint-lite "feat: add feature ✨"
✓ Valid
```

**Option 3:** Use emoji as scope:

```bash
commitlint-lite "feat(✨): add feature"
# Depends on scope validation rules
```

## Best Practices

### 1. Commit early, commit often

**Make small, focused commits:**

```bash
# ❌ Bad - One huge commit
git commit -m "feat: complete user management system"
# Changed 50 files, 2000+ lines

# ✅ Good - Multiple focused commits
git commit -m "feat(api): add user CRUD endpoints"
git commit -m "feat(ui): create user management UI"
git commit -m "test(api): add user endpoint tests"
git commit -m "docs(api): document user endpoints"
```

Benefits:
- Easier to review
- Easier to revert
- Better git history

### 2. Use descriptive but concise descriptions

**Get to the point quickly:**

```bash
# ❌ Bad - Too vague
git commit -m "fix: fix bug"
git commit -m "feat: add stuff"

# ❌ Bad - Too detailed
git commit -m "feat: implement a comprehensive user authentication system with support for OAuth2, JWT tokens, refresh token rotation, and role-based access control for enterprise applications"

# ✅ Good - Clear and concise
git commit -m "feat(auth): add OAuth2 authentication"
git commit -m "fix(api): prevent memory leak in connection pool"
git commit -m "docs(README): add installation instructions"
```

Keep first line under 72 characters. Add details in the body.

### 3. Use scopes consistently

**Define scopes early and document them:**

```json
// .commitlintrc.json
{
  "scopes": [
    "api",      // Backend API
    "ui",       // User interface
    "auth",     // Authentication
    "db",       // Database
    "ci",       // CI/CD
    "docs"      // Documentation
  ]
}
```

Create a `CONTRIBUTING.md`:

```markdown
## Commit Scopes

- `api` - Backend API changes
- `ui` - UI components and pages
- `auth` - Authentication and authorization
- `db` - Database schema and queries
- `ci` - CI/CD configuration
- `docs` - Documentation
```

### 4. Include breaking changes properly

**Always document breaking changes:**

```bash
# ✅ Good - Clear breaking change
git commit -m "feat(api)!: change authentication endpoint

BREAKING CHANGE: /auth/login now requires OAuth2.
Update client code to use new OAuth2 flow.

Migration guide: docs/migration-v2.md"
```

Breaking changes should:
- Use `!` marker
- Include `BREAKING CHANGE:` in body
- Explain what changed
- Provide migration guide

### 5. Link commits to issues

**Reference issue numbers in commit body:**

```bash
git commit -m "fix(api): resolve timeout issue" -m "
Increased timeout from 5s to 30s for large queries.
Added retry mechanism for transient failures.

Closes #123
Fixes #456
Relates to #789"
```

Most platforms recognize:
- `Closes #123` - Closes issue
- `Fixes #123` - Closes issue
- `Resolves #123` - Closes issue
- `Relates to #123` - Links without closing

### 6. Use revert type for reversions

**Make reverts explicit:**

```bash
# ❌ Bad
git revert abc123
# Creates: "Revert 'feat: add feature'"

# ✅ Good
git revert abc123 --no-edit
git commit --amend -m "revert(api): remove unstable endpoint

This reverts commit abc123.
Endpoint caused memory leaks in production."
```

### 7. Write commit messages in imperative mood

**Use present tense, imperative mood:**

```bash
# ❌ Bad - Past tense
git commit -m "fix: fixed login bug"
git commit -m "feat: added new feature"

# ❌ Bad - Present continuous
git commit -m "fix: fixing login bug"

# ✅ Good - Imperative mood
git commit -m "fix: resolve login issue"
git commit -m "feat: add user authentication"
git commit -m "refactor: simplify error handling"
```

Think: "This commit will [your message]"

### 8. Separate refactoring from features

**Don't mix refactoring with feature work:**

```bash
# ❌ Bad - Mixed changes
git commit -m "feat: add login and refactor auth code"

# ✅ Good - Separate commits
git commit -m "refactor(auth): simplify token validation"
git commit -m "feat(auth): add login functionality"
```

Makes code review easier and rollbacks safer.

### 9. Use conventional commits for better changelogs

**Conventional commits enable automated changelog generation:**

```bash
# Your commits
git log --oneline
feat: add user authentication
fix: resolve memory leak
docs: update API documentation
chore: update dependencies

# Generated changelog (using standard-version)
## [1.1.0] - 2024-01-15

### Features
- add user authentication

### Bug Fixes
- resolve memory leak

### Documentation
- update API documentation
```

Tools that work with conventional commits:
- `standard-version`
- `semantic-release`
- `conventional-changelog`

### 10. Configure commitlint for your team

**Create `.commitlintrc.json` and commit it:**

```json
{
  "types": ["feat", "fix", "docs", "style", "refactor", "test", "chore"],
  "maxLength": 72,
  "requireScope": true,
  "scopes": [
    "api",
    "ui",
    "auth",
    "db",
    "ci"
  ]
}
```

Document in `CONTRIBUTING.md`:

```markdown
## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/).

Format: `type(scope): description`

**Types:** feat, fix, docs, style, refactor, test, chore
**Scopes:** api, ui, auth, db, ci

**Examples:**
```bash
feat(api): add user endpoints
fix(auth): resolve token issue
docs(README): update installation guide
```

Automated validation runs on every commit.
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
