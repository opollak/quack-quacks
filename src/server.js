//src/server.js

//const Server = require('boardgame.io/server').Server;
const Quacks = require('./Game').Quacks;
const server = require('boardgame.io/server').Server({ games: [Quacks] });
server.run(8000);
