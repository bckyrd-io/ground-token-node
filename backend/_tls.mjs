import tls from 'tls';

const host = 'dpg-d8fbkq0g4nts738pfph0-a.oregon-postgres.render.com';
const sock = tls.connect({ host, port: 5432, servername: host, rejectUnauthorized: false, timeout: 10000 }, () => {
  console.log('TLS OK', sock.getProtocol(), JSON.stringify(sock.getPeerCertificate().subject));
  sock.end();
});
sock.on('timeout', () => { console.log('TLS timeout'); sock.destroy(); });
sock.on('error', (e) => console.log('TLS error:', e.message));
