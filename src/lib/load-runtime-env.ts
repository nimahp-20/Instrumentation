import { loadEnvFiles } from './load-env';

let loaded = false;

export function loadRuntimeEnv(): void {
  if (loaded) return;
  loaded = true;
  loadEnvFiles();
}
