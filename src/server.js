//src/server.js

//const Server = require('boardgame.io/server').Server;

import path from 'path';
import serve from 'koa-static';
import mount from 'koa-mount';
import Koa from 'koa';
const { Server, Origins } = require('boardgame.io/server');
const Quacks = require('./Game').Quacks;
const server = Server({
  games: [Quacks],
  origins:[Origins.LOCALHOST_IN_DEVELOPMENT,
    'https://quack-quacks.herokuapp.com/',
  'localhost']
  });
const PORT = process.env.PORT || 8000;

const frontEndAppBuildPath = path.resolve(__dirname, './build');
const static_pages = new Koa();
static_pages.use(serve(frontEndAppBuildPath));
server.app.use(mount('/', static_pages))

server.run(PORT, () => {
  console.log('Serving at port: '+PORT);
  server.app.use(
    async (ctx, next) => await serve(frontEndAppBuildPath)(
      Object.assign(ctx, { path: 'index.js' }),
      next
    )
  );
});
