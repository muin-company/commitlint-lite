import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { parseCommitMessage } from './parser.js';
import { validateCommit } from './validator.js';

test('parseCommitMessage - valid format with scope', () => {
  const result = parseCommitMessage('feat(auth): add login feature');
  
  assert.ok(result);
  assert.equal(result.type, 'feat');
  assert.equal(result.scope, 'auth');
  assert.equal(result.description, 'add login feature');
});

test('parseCommitMessage - valid format without scope', () => {
  const result = parseCommitMessage('fix: resolve token issue');
  
  assert.ok(result);
  assert.equal(result.type, 'fix');
  assert.equal(result.scope, undefined);
  assert.equal(result.description, 'resolve token issue');
});

test('parseCommitMessage - invalid format', () => {
  const result = parseCommitMessage('this is not a conventional commit');
  assert.equal(result, null);
});

test('validateCommit - valid conventional commit', () => {
  const parsed = parseCommitMessage('feat: add new feature');
  const result = validateCommit(parsed);
  
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
});

test('validateCommit - invalid type', () => {
  const parsed = parseCommitMessage('invalid: test message');
  const result = validateCommit(parsed);
  
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('Invalid commit type')));
});

test('validateCommit - custom types', () => {
  const parsed = parseCommitMessage('custom: test message');
  const result = validateCommit(parsed, { types: ['custom', 'feat'] });
  
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
});

test('validateCommit - max length exceeded', () => {
  const longMessage = 'feat: ' + 'a'.repeat(100);
  const parsed = parseCommitMessage(longMessage);
  const result = validateCommit(parsed, { maxLength: 50 });
  
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('exceeds maximum length')));
});

test('validateCommit - scope required', () => {
  const parsed = parseCommitMessage('feat: no scope here');
  const result = validateCommit(parsed, { requireScope: true });
  
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('Scope is required')));
});

test('validateCommit - scope provided when required', () => {
  const parsed = parseCommitMessage('feat(scope): with scope');
  const result = validateCommit(parsed, { requireScope: true });
  
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
});

test('parseCommitMessage - handles whitespace', () => {
  const result = parseCommitMessage('  feat: trimmed message  ');
  
  assert.ok(result);
  assert.equal(result.type, 'feat');
  assert.equal(result.description, 'trimmed message');
});
