import pg from 'pg';
import 'dotenv/config';

const tries = [
  { label: 'env file vars (dotenv)', config: {
      host: process.env.DB_HOST, port: +(process.env.DB_PORT || 5432),
      user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME } },
  { label: 'code defaults (localhost/db_ground_token)', config: {
      host: process.env.DB_HOST || 'localhost', port: +(process.env.DB_PORT || 5432),
      user: process.env.DB_USER || 'postgres', password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'db_ground_token' } },
];

for (const t of tries) {
  if (!t.config.host) { console.log(t.label, '-> no env loaded (dotenv found nothing)'); continue; }
  const c = new pg.Client({ ...t.config, connectionTimeoutMillis: 8000 });
  const safe = `${t.config.user}@${t.config.host}:${t.config.port}/${t.config.database}`;
  try {
    await c.connect();
    const r = await c.query("select table_name from information_schema.tables where table_schema='public' order by 1");
    console.log(`[OK]   ${t.label} (${safe})`);
    console.log('       tables:', r.rows.map(x => x.table_name).join(', ') || '(none)');
    await c.end();
  } catch (e) {
    console.log(`[FAIL] ${t.label} (${safe}) -> ${e.message}`);
    try { await c.end(); } catch {}
  }
}
