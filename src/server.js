//src/server.js

//const Server = require('boardgame.io/server').Server;

import path from 'path';
import serve from 'koa-static';
const Quacks = require('./Game').Quacks;
const server = require('boardgame.io/server').Server({ games: [Quacks] });
const PORT = process.env.PORT || 8000;

const frontEndAppBuildPath = path.resolve(__dirname, './build');
server.app.use(serve(frontEndAppBuildPath))

server.run(PORT, () => {
  server.app.use(
    async (ctx, next) => await serve(frontEndAppBuildPath)(
      Object.assign(ctx, { path: 'index.html' }),
      next
    )
  )
});
