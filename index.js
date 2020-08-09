const http = require('http');
const { app } = require('./src/app');

const PORT = 8001;

const server = http.createServer(app);

server.listen(PORT, '127.0.0.1', () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
