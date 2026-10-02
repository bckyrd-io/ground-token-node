import pg from 'pg';

const cfg = {
  host: 'dpg-d8fbkq0g4nts738pfph0-a.oregon-postgres.render.com',
  port: 5432,
  user: 'postgres_ground_token_user',
  password: 'jcXIvryTZJTmO2qunORrElO0tf4V2Pbr',
  database: 'postgres_ground_token',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
};

const c = new pg.Client(cfg);
try {
  await c.connect();
  const t = await c.query("select table_name from information_schema.tables where table_schema='public' order by 1");
  console.log('[OK] render db reachable, tables:', t.rows.map(r => r.table_name).join(', ') || '(none)');
  for (const t2 of ['activities', 'tokens', 'users']) {
    try {
      const r = await c.query(`select count(*) as c from "${t2}"`);
      console.log(`   ${t2}: ${r.rows[0].c} rows`);
    } catch (e) { console.log(`   ${t2}: ${e.message}`); }
  }
  await c.end();
} catch (e) {
  console.log('[FAIL]', e.message);
  try { await c.end(); } catch {}
}
