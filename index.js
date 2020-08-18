const http = require('http');
const mongoose = require('mongoose');

const { app } = require('./src/app');

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Successfully connected to database'));

const server = http.createServer(app);

server.listen(PORT, '127.0.0.1', () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
