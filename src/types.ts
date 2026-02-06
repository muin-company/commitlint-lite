export interface CommitlintConfig {
  types?: string[];
  maxLength?: number;
  requireScope?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ParsedCommit {
  type: string;
  scope?: string;
  description: string;
  raw: string;
}
