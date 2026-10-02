import net from 'net';
import tls from 'tls';

const host = 'dpg-d8fbkq0g4nts738pfph0-a.oregon-postgres.render.com';
const s = net.connect({ host, port: 5432, timeout: 10000 }, () => {
  const buf = Buffer.alloc(8);
  buf.writeInt32BE(8, 0);
  buf.writeInt32BE(80877103, 4); // SSLRequest
  s.write(buf);
});
s.on('data', (d) => {
  console.log('reply byte:', JSON.stringify(String.fromCharCode(d[0])), d.toString('hex'));
  if (String.fromCharCode(d[0]) === 'S') {
    s.removeAllListeners('data');
    // now speak startup with cleartext credentials
    const user = 'postgres_ground_token_user';
    const db = 'postgres_ground_token';
    const pass = 'jcXIvryTZJTmO2qunORrElO0tf4V2Pbr';
    const params = `user\0${user}\0database\0${db}\0\0`;
    const body = Buffer.from(params, 'utf8');
    const msg = Buffer.alloc(8 + body.length);
    msg.writeInt32BE(8 + body.length, 0);
    msg.writeInt32BE(196608, 4);
    body.copy(msg, 8);
    const secure = tls.connect({ socket: s, servername: host, rejectUnauthorized: false }, () => {
      secure.write(msg);
    });
    secure.on('data', (d2) => {
      const t = d2.toString('utf8').replace(/[^\x20-\x7e]/g, '.');
      console.log('auth reply:', t);
      secure.end();
    });
    secure.on('error', (e) => console.log('tls err', e.message));
  }
});
s.on('timeout', () => { console.log('timeout'); s.destroy(); });
s.on('error', (e) => console.log('err', e.message));
s.on('close', () => console.log('closed'));
