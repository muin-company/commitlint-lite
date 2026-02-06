#!/usr/bin/env node

import { readFileSync, writeFileSync, chmodSync, existsSync } from 'fs';
import { join } from 'path';
import { parseCommitMessage } from './parser.js';
import { validateCommit } from './validator.js';
import { loadConfig } from './config.js';

const HOOK_TEMPLATE = `#!/usr/bin/env sh
# commitlint-lite commit-msg hook

MESSAGE_FILE="$1"
MESSAGE=$(cat "$MESSAGE_FILE")

npx commitlint-lite --stdin <<EOF
$MESSAGE
EOF
`;

function printHelp() {
  console.log(`
commitlint-lite - Lightweight commit message linter

Usage:
  commitlint-lite <message>        Validate a commit message
  commitlint-lite --stdin          Read message from stdin (for git hooks)
  commitlint-lite --init-hook      Install git commit-msg hook
  commitlint-lite --help           Show this help message

Options:
  --json                           Output results as JSON

Examples:
  commitlint-lite "feat: add login"
  echo "fix(auth): resolve token issue" | commitlint-lite --stdin
  commitlint-lite --init-hook

Configuration:
  Create a .commitlintrc.json file in your project root:
  {
    "types": ["feat", "fix", "docs"],
    "maxLength": 72,
    "requireScope": false
  }
`);
}

function initHook() {
  const gitDir = join(process.cwd(), '.git');
  
  if (!existsSync(gitDir)) {
    console.error('Error: Not a git repository (no .git directory found)');
    process.exit(1);
  }

  const hooksDir = join(gitDir, 'hooks');
  const hookPath = join(hooksDir, 'commit-msg');

  try {
    writeFileSync(hookPath, HOOK_TEMPLATE, { mode: 0o755 });
    console.log('✓ Git commit-msg hook installed successfully');
    console.log(`  Location: ${hookPath}`);
  } catch (error) {
    console.error(`Error: Failed to create hook: ${error}`);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  if (args.includes('--init-hook')) {
    initHook();
    process.exit(0);
  }

  const jsonOutput = args.includes('--json');
  const useStdin = args.includes('--stdin');

  let message: string;

  if (useStdin) {
    // Read from stdin
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    message = Buffer.concat(chunks).toString('utf-8').trim();
  } else {
    // Get message from arguments
    message = args.filter(arg => !arg.startsWith('--')).join(' ');
  }

  if (!message) {
    console.error('Error: No commit message provided');
    process.exit(1);
  }

  // Load config and validate
  const config = loadConfig();
  const parsed = parseCommitMessage(message);
  const result = validateCommit(parsed, config);

  if (jsonOutput) {
    console.log(JSON.stringify({
      valid: result.valid,
      errors: result.errors,
      parsed: parsed || null
    }, null, 2));
  } else {
    if (result.valid) {
      console.log('✓ Commit message is valid');
    } else {
      console.error('✗ Commit message validation failed:\n');
      result.errors.forEach(error => {
        console.error(`  • ${error}`);
      });
    }
  }

  process.exit(result.valid ? 0 : 1);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
