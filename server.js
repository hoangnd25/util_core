const express = require('express');
const next = require('next');
const routes = require('./routes');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = routes.getRequestHandler(app);

app.prepare().then(() => {
  const server = express();

  server.get("*", (req, res) => {
    /* serving page */
    const { route, query } = routes.match(req.url);
    if (!route) {
      return handle(req, res);
    }
    return app.render(req, res, route.page, query);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`)
  })
});
