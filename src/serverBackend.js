//src/server.js

//const Server = require('boardgame.io/server').Server;

const { Server, Origins } = require('boardgame.io/server');
const Quacks = require('./Game').Quacks;
const server = Server({
  games: [Quacks],
  origins:[Origins.LOCALHOST_IN_DEVELOPMENT,
    'https://quack-quacks.herokuapp.com/',
  'localhost']
  });
const PORT = process.env.PORT || 8000;

server.run(PORT);
