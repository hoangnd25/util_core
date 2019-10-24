const next = require('next');
const routes = require('./routes');
const app = next({ dev: process.env.NODE_ENV !== 'production' });

const { createServer } = require('http');
app.prepare().then(() => createServer(routes.getRequestHandler(app)).listen(3000));
