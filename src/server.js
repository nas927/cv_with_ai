import * as http from 'http'; 
 
const server = http.createServer((request, response) => {
  const url = new URL(
    request.url ?? '/',
    `http://${request.headers.host ?? 'localhost'}`
  );
 
  if (request.method === 'GET' && url.pathname === '/health') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }
 
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Hello from Node.js on Vercel');
});
 
server.listen(Number(3000));