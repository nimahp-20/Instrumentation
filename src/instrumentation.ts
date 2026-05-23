export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { loadLiaraEnvIntoProcess } = await import('../lib/load-liara-env');
    const loaded = loadLiaraEnvIntoProcess();
    if (loaded) {
      console.log('✅ Loaded environment from liara.env');
    }
    const { resolveMongoUri, getMongoHostForLog } = await import('./lib/mongo-uri');
    const mongoUri = resolveMongoUri();
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is missing (set in liara.env).');
    } else {
      console.log(`📂 MongoDB host: ${getMongoHostForLog(mongoUri)}`);
    }
  }
}
