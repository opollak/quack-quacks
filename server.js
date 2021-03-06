//src/server.js

//const Server = require('boardgame.io/server').Server;

import path from 'path';
import serve from 'koa-static';
//import mount from 'koa-mount';
//import Koa from 'koa';
const { Server, Origins } = require('boardgame.io/server');
const Quacks = require('./src/Game').Quacks;
const server = Server({
  games: [Quacks],
  origins:[Origins.LOCALHOST_IN_DEVELOPMENT,
    'https://quack-quacks.herokuapp.com',
  'http://localhost','http://127.0.0.1','http://localhost:8000']
  });
const PORT = process.env.PORT || 8000;

const frontEndAppBuildPath = path.resolve(__dirname, './build');
//server.app.use(serve(frontEndAppBuildPath));
//const static_pages = new Koa();
//static_pages.use(serve(frontEndAppBuildPath));
//server.app.use(mount('/', static_pages))
server.app.use(serve(frontEndAppBuildPath, {index: 'index.html'}))

server.run(PORT, () => {
  console.log('Serving at port: '+PORT);
  server.app.use(
    async (ctx, next) => await serve(frontEndAppBuildPath)(
      Object.assign(ctx, { path: 'index.html' }),
      next
    )
  );
});
