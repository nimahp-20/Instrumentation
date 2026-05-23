import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { loadLiaraEnvIntoProcess } from '../../lib/load-liara-env';

/** Load .env.local first; liara.env only fills missing vars (for Liara server deploy). */
export function loadEnvFiles(): void {
  for (const file of ['.env.local', '.env']) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;

    let content = readFileSync(path, 'utf-8');
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      // .env.local always wins locally (liara.env may already be set via mongodb import)
      if (file === '.env.local' || process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
  loadLiaraEnvIntoProcess();
}
