//src/App.js

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
const server = 'http://localhost:8000';
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
    <h4><a target="_blank" rel="noopener noreferrer" href="https://cdn.shopify.com/s/files/1/0283/4324/files/Quackrules_Almanac_English.pdf?243">Rules PDF</a></h4>
    <p><a target="_blank" rel="noopener noreferrer" href="https://www.northstargames.com/collections/strategy-games/products/the-quacks-of-quedlinburg">The Quacks of Quedlinburg</a> is the intellectual property of <a target="_blank" rel="noopener noreferrer" href="https://www.northstargames.com/">North Star Games.</a> This online verison was created by Oren Pollak for personal use only as an homage and programming practice.</p>
    <h2>Enter lobby and join a game</h2>
    <Lobby gameServer={server} lobbyServer={server}
    gameComponents={importedGames} debug={true}/>
  </div>
);
//multiplayer
/*
class App extends React.Component {
  state = { numPlayers: null, playerID: null, gameID: null, gameIdTemp: null};


  render() {
    if (this.state.gameID === null) {
      return (
        <div>
          <p>Start a new game with how many players?</p>
          <p><button onClick={() => this.setState({ numPlayers: 2,
            gameID: randomWords({ exactly: 2, join: '-'}) })}>
            2 Player Game
          </button></p>
          <p><button onClick={() => this.setState({ numPlayers: 3,
            gameID: randomWords({ exactly: 2, join: '-'}) })}>
            3 Player Game
          </button></p>
          <p><button onClick={() => this.setState({ numPlayers: 4,
            gameID: randomWords({ exactly: 2, join: '-'}) })}>
            4 Player Game
          </button></p>
          <p>Join an existing game instead</p>
          <form>
            <p><input type='text' name='gameIdInput'
            onChange= {(event) => this.setState({
              gameIdTemp: event.target.value})}/></p></form>
            <p><button onClick={() => {this.setState({
              gameID: this.state.gameIdTemp});}}>
              Join Game
            </button></p>
        </div>
      );
    }

    if (this.state.gameID !== null && this.state.playerID === null) {
      return (
        <div>
          <p>Play as:</p>
          <button onClick={() => this.setState({ playerID: "0" })}>
            Player 0
          </button>
          <button onClick={() => this.setState({ playerID: "1" })}>
            Player 1
          </button>
          <button onClick={() => this.setState({ playerID: "2" })}>
            Spectator
          </button>
        </div>
      );
    }
    if (this.state.gameID !== null && this.state.playerID !== null) {
      return (
        <div>
          <h3>{this.state.numPlayers} Player Game: {this.state.gameID}</h3>
          <QQClient playerID={this.state.playerID}
          numPlayers={this.state.numPlayers}
          gameID = {this.state.gameID}/>
        </div>
      );
    }
  }
}
*/

//single player mode
/*
const App = () => (
  <div>
    <h1>Player 0</h1>
    <QQClient playerID="0"/>
    <h1>Player 1</h1>
    <QQClient playerID="1"/>
  </div>
);
*/

//export default App;
