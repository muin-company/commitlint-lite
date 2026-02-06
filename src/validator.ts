import type { CommitlintConfig, ValidationResult, ParsedCommit } from './types.js';

const DEFAULT_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'test',
  'chore',
  'ci',
  'perf',
  'build',
  'revert'
];

const DEFAULT_MAX_LENGTH = 100;

export function validateCommit(
  parsed: ParsedCommit | null,
  config: CommitlintConfig = {}
): ValidationResult {
  const errors: string[] = [];
  const types = config.types || DEFAULT_TYPES;
  const maxLength = config.maxLength ?? DEFAULT_MAX_LENGTH;
  const requireScope = config.requireScope ?? false;

  // Check if message was parsed successfully
  if (!parsed) {
    errors.push(
      'Invalid commit message format. Expected: type(scope): description'
    );
    return { valid: false, errors };
  }

  // Check type
  if (!types.includes(parsed.type)) {
    errors.push(
      `Invalid commit type "${parsed.type}". Allowed types: ${types.join(', ')}`
    );
  }

  // Check scope requirement
  if (requireScope && !parsed.scope) {
    errors.push('Scope is required but not provided');
  }

  // Check description
  if (!parsed.description || parsed.description.trim().length === 0) {
    errors.push('Commit description is required');
  }

  // Check max length
  if (parsed.raw.length > maxLength) {
    errors.push(
      `Commit message exceeds maximum length (${parsed.raw.length} > ${maxLength})`
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
