//src/App.js
//comment
import React from 'react';
import { Lobby } from 'boardgame.io/react';
//import { Local } from 'boardgame.io/multiplayer'; //for local play
//import { SocketIO } from 'boardgame.io/multiplayer'; //for multiplayer
import { QQBoard } from './Board';
import { Quacks } from './Game';
//import logger from 'redux-logger';
//import { applyMiddleware, compose } from 'redux';

//var currentPlayer
//var randomWords = require('random-words');
const { protocol, hostname, port } = window.location;
const server = `${protocol}//${hostname}:${port}`;
console.log(server);
const importedGames = [{ game: Quacks, board: QQBoard }];
/*
const QQClient = Client({
  game: Quacks,
  board: QQBoard,

  debug: true,
  //multiplayer: Local(), //for local play
  multiplayer: SocketIO({server: server}), //for multiplayer
});*/
export default () => (
  <div>
    <h1>Quacks of Quedlinburg</h1>
    <h4><a target="_blank" rel="noopener noreferrer" href="https://cdn.1j1ju.com/medias/ba/73/db-the-quacks-of-quedlinburg-rulebook.pdf">Rules PDF</a></h4>
    <p><a target="_blank" rel="noopener noreferrer" href="https://shop.asmodee.com/quacks-of-quedlinburg-qak00">The Quacks of Quedlinburg</a> is the intellectual property of <a target="_blank" rel="noopener noreferrer" href="https://shop.asmodee.com/">Asmodee Games.</a> This online verison was created by Oren Pollak for personal use only as an homage and programming practice.</p>
    <h2>Enter lobby and join a game</h2>
    <Lobby gameServer={server} lobbyServer={server}
    gameComponents={importedGames} debug={false}/>
  </div>
);

//export default App;
