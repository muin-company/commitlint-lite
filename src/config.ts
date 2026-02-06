import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { CommitlintConfig } from './types.js';

export function loadConfig(cwd: string = process.cwd()): CommitlintConfig {
  const configPath = join(cwd, '.commitlintrc.json');
  
  if (!existsSync(configPath)) {
    return {};
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Warning: Failed to parse .commitlintrc.json: ${error}`);
    return {};
  }
}
