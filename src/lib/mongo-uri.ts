/** Canonical MongoDB database name for this app */
export const MONGODB_DB_NAME = (process.env.MONGODB_DB_NAME || 'tools').trim();

/** Normalize URI: map /test → /tools and ensure a database path exists */
export function normalizeMongoUri(uri: string): string {
  const trimmed = uri.trim();
  if (!trimmed) return trimmed;

  let u = trimmed.replace(/\/test(?=[/?#]|$)/gi, `/${MONGODB_DB_NAME}`);
  // Fix copy-paste: @mongodb:kilimanjaro... → @kilimanjaro...
  u = u.replace(/@mongodb:/gi, '@');
  // Private DNS only works when DB is linked; prefer public Liara host in liara.env
  u = u.replace(/@(tools|mongo):27017/gi, '@kilimanjaro.liara.cloud:31059');

  const pathBase = u.split('?')[0].split('#')[0];
  const authority = pathBase.match(/^mongodb(?:\+srv)?:\/\/[^/]+/)?.[0];
  if (!authority) return u;

  const dbPath = pathBase.slice(authority.length);
  const hasDatabase = dbPath.length > 1 && dbPath.startsWith('/');

  if (!hasDatabase) {
    const q = u.indexOf('?');
    const h = u.indexOf('#');
    const cut = q >= 0 ? q : h >= 0 ? h : u.length;
    u = `${u.slice(0, cut).replace(/\/$/, '')}/${MONGODB_DB_NAME}${u.slice(cut)}`;
  }

  return u;
}

export function resolveMongoUri(raw?: string): string {
  const fromEnv =
    raw ||
    process.env.MONGODB_URI ||
    process.env['MONGODB_URI'] ||
    '';
  return normalizeMongoUri(fromEnv);
}

export function getMongoHostForLog(uri: string): string {
  try {
    const normalized = normalizeMongoUri(uri);
    const withoutScheme = normalized.replace(/^mongodb(?:\+srv)?:\/\//, '');
    const afterAuth = withoutScheme.includes('@')
      ? withoutScheme.slice(withoutScheme.indexOf('@') + 1)
      : withoutScheme;
    return afterAuth.split('/')[0].split('?')[0];
  } catch {
    return 'unknown';
  }
}

export function assertToolsDatabase(dbName: string): void {
  if (dbName !== MONGODB_DB_NAME) {
    throw new Error(
      `Wrong MongoDB database "${dbName}" — expected "${MONGODB_DB_NAME}". ` +
        `Set MONGODB_URI with /${MONGODB_DB_NAME} in the path (not /test).`
    );
  }
}
