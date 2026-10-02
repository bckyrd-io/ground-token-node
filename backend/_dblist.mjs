import pg from 'pg';

const admin = new pg.Client({ host: 'localhost', port: 5432, user: 'postgres', password: 'postgres', database: 'postgres' });
await admin.connect();
const dbs = await admin.query("select datname from pg_database where datistemplate = false order by 1");
console.log('databases:', dbs.rows.map(r => r.datname).join(', '));
await admin.end();

for (const db of dbs.rows.map(r => r.datname)) {
  const c = new pg.Client({ host: 'localhost', port: 5432, user: 'postgres', password: 'postgres', database: db });
  try {
    await c.connect();
    const t = await c.query("select table_name from information_schema.tables where table_schema='public' order by 1");
    const cnt = await c.query('select count(*) c from pg_stat_user_tables');
    console.log(`- ${db}: ${cnt.rows[0].c} tables -> ${t.rows.map(r => r.table_name).join(', ') || '(none)'}`);
    await c.end();
  } catch (e) {
    console.log(`- ${db}: FAIL ${e.message}`);
    try { await c.end(); } catch {}
  }
}
