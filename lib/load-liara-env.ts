import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export function parseEnvFile(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

export function liaraEnvCandidatePaths(): string[] {
  const cwd = process.cwd();
  return [
    join(cwd, 'liara.env'),
    join(cwd, '..', 'liara.env'),
    join(cwd, '..', '..', 'liara.env'),
    '/app/liara.env',
    '/usr/src/app/liara.env',
  ];
}

/** Always taken from liara.env (panel copy-paste often uses wrong host mongo/tools). */
const LIARA_ENV_FORCE_KEYS = new Set([
  'MONGODB_URI',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'SEED_SECRET',
]);

export function loadLiaraEnvIntoProcess(): boolean {
  for (const filePath of liaraEnvCandidatePaths()) {
    if (!existsSync(filePath)) continue;

    const vars = parseEnvFile(readFileSync(filePath, 'utf8'));
    for (const [key, value] of Object.entries(vars)) {
      if (LIARA_ENV_FORCE_KEYS.has(key) || !process.env[key]) {
        process.env[key] = value;
      }
    }
    return true;
  }
  return false;
}
