import type { ParsedCommit } from './types.js';

const CONVENTIONAL_COMMIT_REGEX = /^(?<type>\w+)(?:\((?<scope>[^)]+)\))?:\s*(?<description>.+)$/;

export function parseCommitMessage(message: string): ParsedCommit | null {
  const match = message.trim().match(CONVENTIONAL_COMMIT_REGEX);
  
  if (!match || !match.groups) {
    return null;
  }

  return {
    type: match.groups.type,
    scope: match.groups.scope,
    description: match.groups.description,
    raw: message.trim()
  };
}
