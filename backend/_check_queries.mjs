import fs from 'fs';

const content = fs.readFileSync('server.ts', 'utf8');
const queries = [];
const regex = /query\(\s*`([\s\S]*?)`/g;
let m;
while ((m = regex.exec(content)) !== null) {
  queries.push(m[1].replace(/\s+/g, ' ').trim());
}
const regex2 = /query\(\s*'([\s\S]*?)'/g;
while ((m = regex2.exec(content)) !== null) {
  queries.push(m[1].replace(/\s+/g, ' ').trim());
}
console.log('Total queries:', queries.length);
console.log([...new Set(queries)].join('\n---\n'));
