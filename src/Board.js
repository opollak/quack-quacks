// src/Board.js

import React from "react";
import ReactTooltip from "react-tooltip";
import { FortuneCards, ColorRef, ChipText } from './Constants';

export class QQBoard extends React.Component {
  /*  onClick(id) {
    if (this.isActive(id)) {
      console.log('clicked');
    }
  }

  isActive(id) {
    if (!this.props.isActive) return false;
    if (this.props.G.cells[id].number !== "") return false;
    return true;
  }
*/


  render() {

    function bagStyle(colorInput) {
      return{
        border: "1px solid #555",
        backgroundColor: colorSwitch(colorInput),
        color: "#000",
        width: "80px",
        height: "70px",
        lineHeight: "30px",
        textAlign: "center",
        borderRadius: "10px 10px 10px 10px",
        fontSize: "18px",
      }
    };

    function cardStyle(cardNum) {
      return{
        border: "2px solid #000",
        backgroundColor: FortuneCards[cardNum].color,
        color: "#000",
        width: "120px",
        height: "180px",
        lineHeight: "15px",
        textAlign: "center",
        borderRadius: "5px 5px 5px 5px",
        fontSize: "13px",
      }
    };

    function flaskStyle(colorInput) {
      return{
        border: "1px solid #555",
        backgroundColor: colorSwitch(colorInput),
        color: "#000",
        width: "50px",
        height: "70px",
        lineHeight: "30px",
        textAlign: "center",
        display: "block",
        borderRadius: "20px 20px 50px 50px",
        fontSize: "18px",
      }
    };

    function titleStyle(colorInput) {
      return{
        border: "1px solid #555",
        backgroundColor: colorSwitch(colorInput),
        color: "#000",
        width: "80px",
        height: "40px",
        lineHeight: "20px",
        textAlign: "left"
      }
    };

    const scrollStyle = {
      height: "200px",
      overflowY: "auto",
      border: "1px solid black",
      fontSize: "13px",
    };

    function colorSwitch(colorInput) {
      let color = "";
      switch (colorInput) {
        case "orange":
          color = "#ffa500";
          break;
        case "0":
          color = "#6f6";
          break;
        case "green":
          color = "#0f0";
          break;
        case "1":
          color = "#6af";
          break;
        case "blue":
          color = "#38f";
          break;
        case "purple":
          color = "#a5c"; //83f
          break;
        case "black":
          color = "#000";
          break;
        case "2":
          color = "#f66";
          break;
        case "red":
          color = "#f00";
          break;
        case "3":
          color = "#ff6";
          break;
        case "yellow":
          color = "#ff0";
          break;
        case "white":
          color = "#fff";
          break;
        default:
          color = "#999";
      }
      return color;
    }

    function chipStyle(colorInput, ruby) {
      let textColor = "#000";
      if (ruby) {
        textColor = "#f00";
      }
      if (colorInput === 'black') {
        textColor = '#fff'
      }
      return {
        border: "1px solid #555",
        backgroundColor: colorSwitch(colorInput),
        borderRadius: (colorInput==="" ?  "0px" : "20px"),
        color: textColor,
        width: "40px",
        height: "40px",
        lineHeight: "18px",
        textAlign: "center",
        fontSize: "14px",
      };
    }

    function inDrawStage(stage) {return stage === "drawStage";}
    function inStopDrawingStage(stage) {return stage === "stopDrawingStage";}
    function inRatStage(stage) {return stage === "ratStage";}
    function inSelectStage(stage) {return stage === "selectStage";}
    function inStirredStage(stage) {return stage === "wellStirredStage";}
    function inSecondChanceStage(stage) {return stage === "secondChanceStage";}
    //function inStopStage(stage) {return (stage === "stopDrawStage"||stage==="scoreStage");}

//Instantiation
    let tbody = [];
    let tscoreboard = [<p>Scoreboard</p>];
    let tooltips = [];
    let kmax = this.props.ctx.numPlayers;
    let p = parseInt(this.props.playerID);
    let winner = "";
    if (this.props.ctx.gameover) {
      winner =
        this.props.ctx.gameover.winner !== undefined ? (
          <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
        ) : (
          <div id="winner">Draw!</div>
        );
    }

//Selector section
    if (this.props.ctx.phase==="strongIngredientPhase"
      ||(this.props.ctx.activePlayers&&inSelectStage(this.props.ctx.activePlayers[this.props.playerID]))) {
        let imax = this.props.G.players[p].selector.length;
        if (imax===0) {
          if (this.props.playerID===this.props.ctx.currentPlayer) {tbody.push(<tr height="20px"><td colspan="6">You exploded, click "Select None".</td></tr>);}
        }
        else if (this.props.playerID === this.props.ctx.currentPlayer||(this.props.ctx.activePlayers&&inSelectStage(this.props.ctx.activePlayers[this.props.playerID])))
        {tbody.push(<tr height="20px"><td colspan="6">Select up to 1 chip to add to your pot:</td></tr>);}

      let cells = [];
        for (let i = 0; i < imax; i++) {
          if (this.props.G.players[p].selector[i]) {
            cells.push(
              <td style={chipStyle(
                  this.props.G.players[p].selector[i].type, false
                )} key={1100 + i} onClick={() => {
                  this.props.moves.selectToPot(i);}}>
                <b>{this.props.G.players[p].selector[i].number}</b>
              </td>
            );
          }
        }
      if (this.props.playerID === this.props.ctx.currentPlayer||(this.props.ctx.activePlayers&&inSelectStage(this.props.ctx.activePlayers[this.props.playerID])))
      {cells.push(<td colspan="2"><button onClick={() => {
        this.props.moves.selectNone();}}>
      Select None</button></td>);
      }
      tbody.push(<tr key={1110}>{cells}</tr>);
    }
    if (this.props.ctx.activePlayers&&(this.props.ctx.activePlayers[this.props.playerID]==="opportunisticStage")) {
        let imax = this.props.G.players[p].selector.length;
        tbody.push(<tr height="20px"><td colspan="6">Select 1 chip to trade in:</td></tr>);
        let cells = [];
        for (let i = 0; i < imax; i++) {
          if (this.props.G.players[p].selector[i]) {
            cells.push(
              <td style={chipStyle(
                  this.props.G.players[p].selector[i].type, false
                )} key={1100 + i} onClick={() => {
                  this.props.moves.selectToUpgrade(i);}}>
                <b>{this.props.G.players[p].selector[i].number}</b>
              </td>
            );
          }
        }
      cells.push(<td colspan="2"><button onClick={() => {
        this.props.moves.selectNone();}}>
      Green 1-chip</button></td>)
      tbody.push(<tr key={1110}>{cells}</tr>);
    }
    if (this.props.ctx.activePlayers&&(this.props.ctx.activePlayers[this.props.playerID]==="lessIsMoreStage")) {
        let imax = this.props.G.players[p].selector.length;
        tbody.push(<tr height="20px"><td colspan="6">You drew 5 chips:</td></tr>);
        let cells = [];
        for (let i = 0; i < imax; i++) {
          if (this.props.G.players[p].selector[i]) {
            cells.push(
              <td style={chipStyle(
                  this.props.G.players[p].selector[i].type, false
                )} key={1100 + i}>
                <b>{this.props.G.players[p].selector[i].number}</b>
              </td>
            );
          }
        }
      cells.push(<td colspan="2"><button onClick={() => {
        this.props.moves.lessIsMoreMove();}}>
      {this.props.G.players[p].lessIsMoreWinner ? "Take Blue 2-Chip" : "Take a Ruby"}</button></td>)
      tbody.push(<tr key={1110}>{cells}</tr>);
    }
//Scoreboard
    let playerTempID = 0;
    if (this.props.playerID !== null) {
      playerTempID = p;
    }
    let playerTemp = [this.props.G.players[playerTempID],
    ...this.props.G.players.slice(0,playerTempID),
    ...this.props.G.players.slice(playerTempID+1,
      this.props.G.players.length)];
    let scoreTemp = [this.props.G.score[playerTempID],
    ...this.props.G.score.slice(0,playerTempID),
    ...this.props.G.score.slice(playerTempID+1,
      this.props.G.score.length)];
      for (let k = 0; k < kmax; k++) {
        let cells = [];
        for (let i = 0; i < 3; i++) {
          if (i === 0) {
            cells.push(
              <td style={titleStyle(playerTemp[k].id.toString())}
              key={(100*k + 54 + i)}
              >Player {playerTemp[k].id.toString()} {playerTemp[k].flaskFull ? "FF" : ""}
              <br />{playerTemp[k].exploded ? "Exploded" :
                this.props.ctx.activePlayers ? (inDrawStage(this.props.ctx.activePlayers[playerTemp[k].id]) ||
                inStirredStage(this.props.ctx.activePlayers[playerTemp[k].id]) ||
                inSelectStage(this.props.ctx.activePlayers[playerTemp[k].id]) ||
                inStopDrawingStage(this.props.ctx.activePlayers[playerTemp[k].id])) ? "Drawing" :
                inRatStage(this.props.ctx.activePlayers[playerTemp[k].id]) ? "Using Rats" : "Stopped" : ""}</td>
            );
          }
          if (i === 1) {
            cells.push(
            <td style={titleStyle(playerTemp[k].id.toString())}
            key={(100*k + 54 + i)}>Score: {scoreTemp[k]}
            <br />Rubies: {playerTemp[k].rubies}</td>
            );
          }
          if (i === 2) {
            /*if (playerTemp[k].exploded) {
            cells.push(
            <td style={titleStyle(playerTemp[k].id.toString())}
            key={(100*k + 54 + i)}>BOOM</td>);}
            else {cells.push(
            <td style={titleStyle(playerTemp[k].id.toString())}
            key={(100*k + 54 + i)}>   </td>);}*/
          }
        }
        tscoreboard.push(<tr>{cells}</tr>);
      }
  //Boards aka Pots
    for (let k = 0; k < kmax; k++) {
      tbody.push(<tr height="20px" key={(100*k + 54 + 3)}/>);
      for (let i = 0; i < 3; i++) {
        let cells = [];
        for (let j = 0; j < 18; j++) {
          const id = 18 * i + j;
          if (
            playerTemp[k].pot[id].chip !== null
          ) {
            cells.push(
              <td
                style={chipStyle(
                  playerTemp[k].pot[id].chip.type, false
                )} key={(100*k + id)}
              >
                <b>{playerTemp[k].pot[id].chip.number}</b>
              </td>
            );
          } else {
            if (playerTemp[k].pot[id].ruby) {
              cells.push(
                <td style={chipStyle("", true)} key={(100*k + id)}>
                  <b>{playerTemp[k].pot[id].coins}</b>
                  <br />
                  {playerTemp[k].pot[id].points}r
                </td>
              );
            } else {
              cells.push(
                <td style={chipStyle("", false)} key={(100*k + id)}>
                  <b>{playerTemp[k].pot[id].coins}</b>
                  <br />
                  {playerTemp[k].pot[id].points}
                </td>
              );
            }
          }
        }
        tbody.push(<tr key={i + (3 * k)}>{cells}</tr>);
      }
    }
    let tplayer = [];
    let theader = [];
    let tmessage = [];
//Header
    if (p < kmax) {
      let didExplode = "";
      if (this.props.G.players[p].exploded) {
        didExplode = " EXPLODED!";
      }
      theader.push(<div><h2>You are Player {this.props.playerID}</h2></div>);
//Messages
      let m = this.props.G.players[p].message.slice().reverse();
      for (let i = 0; i < m.length; i++) {
        if (i < this.props.G.players[p].unreadMessages) {tmessage.push(<p><b>{m[i]}</b></p>);}
        else {tmessage.push(<p>{m[i]}</p>)}
      }
      theader.push(<div style={scrollStyle}>{tmessage}</div>);
//Player panel - bag, flask, white total, buttons. Most card stages are here.
      tplayer.push(
        <tr><td colspan="2">
          White total:{" "}<b>
          {this.props.G.players[p].whiteTotal}
          {didExplode}</b>
        </td></tr>);
      tplayer.push(<tr><td style={bagStyle(this.props.playerID)}
          onClick={() => {this.props.moves.drawFromBag();}}>
        Bag has <br />
        <b>
        {this.props.G.players[p].bag.length}
        </b> Chips
      </td>
      <td style={flaskStyle(this.props.playerID)}
        onClick={() => {this.props.moves.useFlask();}}>
        Flask<br />
        {this.props.G.players[p].flaskFull ? "Full" : "Empty"}
      </td></tr>);

      if ((this.props.playerID !== this.props.ctx.currentPlayer) && (!this.props.ctx.activePlayers)) {
        tplayer.push(<div>Waiting for Player {this.props.ctx.currentPlayer.toString()}</div>);
      } else if (this.props.ctx.activePlayers&&!this.props.ctx.activePlayers[this.props.playerID]) {
        tplayer.push(<div>Waiting for other player(s)</div>);
      }

      if (this.props.ctx.phase==="rubyPhase" && this.props.playerID === this.props.ctx.currentPlayer) {
        tplayer.push(<tr><button onClick={() => {this.props.moves.takeRubies();}}>
          Receive Ruby?
          </button></tr>);
        }

      if (this.props.ctx.phase==="pointPhase" && this.props.playerID === this.props.ctx.currentPlayer) {
        if (didExplode===" EXPLODED!") {
          tplayer.push(<tr><button onClick={() => {this.props.moves.choosePoints();}}>
            Choose Points
            </button></tr>);
          tplayer.push(<tr textAlign='center'>or</tr>);
          tplayer.push(<tr><button onClick={() => {this.props.moves.chooseCoins();}}>
            Choose Coins
            </button></tr>);
          }
        else {
          tplayer.push(<tr><button onClick={() => {this.props.moves.takePoints();}}>
            Receive Points and Coins
            </button></tr>);
          }
        }

      if (this.props.ctx.phase==="buyPhase") {
        tplayer.push(<tr><td colspan="2">
          Coins to spend: <b>{this.props.G.players[p].playerCoins}</b>
          </td></tr>);
      }
      if (this.props.ctx.phase==="buyPhase" && this.props.playerID === this.props.ctx.currentPlayer) {
        tplayer.push(<tr><td colspan="2">
          Your turn to buy!
          </td></tr>);
        tplayer.push(<tr><td colspan="2"><button onClick={() => {this.props.moves.doneBuying();}}>
          Done Buying
          </button></td></tr>);
          if (this.props.G.round === 9) {
            tplayer.push(<tr><td colspan="2"><button onClick={() => {this.props.moves.coinsToPoints();}}>
              Exchange Coins for Points (5:1)
              </button></td></tr>);
            }
      }

      if (this.props.ctx.activePlayers&&(this.props.ctx.activePlayers[this.props.playerID]==="buy1ChipStage"||
          this.props.ctx.activePlayers[this.props.playerID]==="buy2ChipStage"||
          this.props.ctx.activePlayers[this.props.playerID]==="buy4ChipStage")) {
        tplayer.push(<tr><td colspan="2">
          Click on a valid chip in the store to buy
          </td></tr>);
      }

      if (this.props.ctx.activePlayers&&inDrawStage(this.props.ctx.activePlayers[this.props.playerID])) {
        tplayer.push(
          <div>
            <button onClick={() => {
              this.props.moves.stopDrawing1();}}>
            Stop Drawing</button>
          </div>);
      }
      if (this.props.ctx.activePlayers&&inStopDrawingStage(this.props.ctx.activePlayers[this.props.playerID])) {
        tplayer.push(
          <div>
            <tr>Are you sure you want to stop drawing?</tr>
            <tr><button onClick={() => {
              this.props.moves.stopDrawing2();}}>
            Yes, Stop Drawing</button></tr>
            <tr><button onClick={() => {
              this.props.moves.keepDrawing();}}>
            No, Keep Going</button></tr>
          </div>);
      }
      else if (this.props.ctx.activePlayers&&inRatStage(this.props.ctx.activePlayers[this.props.playerID])) {
        tplayer.push(
          <div>
            <button onClick={() => {
              this.props.moves.useRats();}}>
            Use Rats ({this.props.G.players[this.props.playerID].rats})</button>
          </div>);
      }
      else if (this.props.ctx.activePlayers&&inStirredStage(this.props.ctx.activePlayers[this.props.playerID])) {
        tplayer.push(
          <div><tr>
            <button onClick={() => {
              this.props.moves.wellStirredYes();}}>
            Return white chip to bag</button>
          </tr><tr>
            <button onClick={() => {
              this.props.moves.wellStirredNo();}}>
            Do not return white chip</button>
          </tr></div>);
      }
      else if (this.props.ctx.activePlayers&&inSecondChanceStage(this.props.ctx.activePlayers[this.props.playerID])) {
        tplayer.push(
          <div><tr>
            <button onClick={() => {
              this.props.moves.secondChanceYes();}}>
            Begin round again</button>
          </tr><tr>
            <button onClick={() => {
              this.props.moves.secondChanceNo();}}>
            Continue</button>
          </tr></div>);
      }

      if (this.props.ctx.activePlayers&&(this.props.ctx.activePlayers[this.props.playerID]==="justInTimeStage")) {
        tplayer.push(
          <div>
            <button onClick={() => {
              this.props.moves.takePoints();}}>
            Take 4 points</button>
            <button onClick={() => {
              this.props.moves.removeChip();}}>
            Remove white chip</button>
          </div>);
      }

      if (this.props.ctx.activePlayers&&(this.props.ctx.activePlayers[this.props.playerID]==="ratsFriendsStage")) {
        tplayer.push(
          <div>
            <button onClick={() => {
              this.props.moves.take4Chip();}}>
            Take any one 4-chip</button>
            <button onClick={() => {
              this.props.moves.ratsForPoints();}}>
            Points instead of rats ({this.props.G.players[this.props.playerID].rats})</button>
          </div>);
      }

      if (this.props.ctx.activePlayers&&(this.props.ctx.activePlayers[this.props.playerID]==="wheelAndDealStage")) {
        tplayer.push(
          <div>
            <button onClick={() => {
              this.props.moves.take1Chip();}}>
            Trade 1 ruby for a 1-chip</button>
            <button onClick={() => {
              this.props.moves.doNothing();}}>
            Do not trade</button>
          </div>);
      }

      if (this.props.ctx.activePlayers&&(this.props.ctx.activePlayers[this.props.playerID]==="goodStartStage")) {
        tplayer.push(
          <div>
            <tr><button onClick={() => {
              this.props.moves.ratsForRubies(0);}}>
            Use rat stone ({this.props.G.players[this.props.playerID].rats}) normally</button></tr>
            <tr><button onClick={() => {
              this.props.moves.ratsForRubies(1);}}>
            Pass up 1 rat</button></tr>
            <tr><button onClick={() => {
              this.props.moves.ratsForRubies(2);}}>
            Pass up 2 rats</button></tr>
            <tr><button onClick={() => {
              this.props.moves.ratsForRubies(3);}}>
            Pass up 3 rats</button></tr>
          </div>);
      }

      if (this.props.ctx.activePlayers&&(this.props.ctx.activePlayers[this.props.playerID]==="chooseWiselyStage")) {
        tplayer.push(
          <div>
            <button onClick={() => {
              this.props.moves.takePurple();}}>
            Take 1 purple chip</button>
            <button onClick={() => {
              this.props.moves.moveDropTwice();}}>
            Move Droplet 2x</button>
          </div>);
      }

      if (this.props.ctx.activePlayers&&(this.props.ctx.activePlayers[this.props.playerID]==="chooseOneOfThreeStage")) {
        tplayer.push(
          <div>
            <tr><button onClick={() => {
              this.props.moves.takeBlack();}}>
            Take 1 black chip</button></tr>
            <tr><button onClick={() => {
              this.props.moves.take2Chip();}}>
            Take any one 2-chip</button></tr>
            <tr><button onClick={() => {
              this.props.moves.takeRubies();}}>
            Take 3 rubies</button></tr>
          </div>);
      }

      if (this.props.ctx.phase==='stopDrawPhase') {
        tplayer.push(
          <div><p>Everyone has finished drawing!</p>
          </div>
        )
      }

      if (this.props.ctx.phase==="bonusPhase" && this.props.playerID === this.props.ctx.currentPlayer) {
        if(this.props.G.players[p].bonus) {
          tplayer.push(<tr><td colspan="2"><button onClick={() => {this.props.moves.rollDie();}}>
            Roll Bonus Die
            </button></td></tr>);}
        else {
          tplayer.push(<tr><td colspan="2"><button onClick={() => {this.props.moves.noBonus();}}>
            No Die Roll
            </button></td></tr>);}
        }

      if (this.props.ctx.phase==="endPhase" && this.props.playerID === this.props.ctx.currentPlayer) {
        if (this.props.G.round < 9) {
          tplayer.push(<tr><td colspan="2"><button onClick={() => {this.props.moves.fillFlask();}}>
            Fill Flask (costs 2 Rubies)
            </button></td></tr>);
          tplayer.push(<tr><td colspan="2"><button onClick={() => {this.props.moves.moveDrop();}}>
            Advance Drop (costs 2 Rubies)
            </button></td></tr>);
          }
        else {
          tplayer.push(<tr><td colspan="2"><button onClick={() => {this.props.moves.rubiesToPoints();}}>
            Receive 1 Point (costs 2 Rubies)
            </button></td></tr>);
          }
          tplayer.push(<tr><td colspan="2"><button onClick={() => {this.props.events.endTurn();}}>
            End Turn
            </button></td></tr>);
        }

//Game over and round number section
    }
    if (this.props.ctx.gameover) {
      if ('winner' in this.props.ctx.gameover) {
        theader.push(<div><h1>Game Over, Player {this.props.ctx.gameover.winner} Wins!</h1></div>);
      }
      else {
        theader.push(<div><h1>Game Over, Draw!</h1></div>);
      }
    }
    else {
      theader.push(<div><h3>Round {this.props.G.round}</h3></div>);
      if (this.props.G.round === 9) {
        theader.push(<div><h3>FINAL ROUND</h3></div>);
      }
      if (!this.props.ctx.activePlayers) {
        theader.push(<div><h4>Player {this.props.ctx.currentPlayer}'s Turn</h4></div>);
      }
    }
//Fortune Cards
    let tcard = [];
    if (this.props.ctx.phase==='cardPhase' &&
        this.props.ctx.currentPlayer===this.props.playerID && !this.props.ctx.activePlayers) {
      tcard.push(
        <button onClick={() => {
            this.props.moves.drawCard();}}>
          Draw Fortune Card</button>
        );
    }
    tcard.push(
      <div style={cardStyle(this.props.G.currCard)}>
      <b>{FortuneCards[this.props.G.currCard].title}</b><br /><br />
      {FortuneCards[this.props.G.currCard].text}</div>
    );
//Store
    let tstore = [<tr><td colspan="3" textAlign='center'>Store</td></tr>];
    for (let i = 2; i < 7; i++) {
      let row = [];
      if (i === 2) {
        for (let j = -2; j < 1; j++) {
          let ttid = 1000+j;
          row.push(<td style={chipStyle(ColorRef[i+j],false)} onClick={() => {
              this.props.moves.buyChip(ColorRef[i+j],1);}} key={ttid}
              data-tip data-for={ttid.toString()}>
          {this.props.G.store[ColorRef[i+j]][1]}<br />
          ${this.props.G.storeCost[ColorRef[i+j]][1]}</td>);
          tooltips.push(<ReactTooltip id={ttid.toString()}
          overridePosition={ (
          { left, top },
          currentEvent, currentTarget, node) => {
          const d = document.documentElement;
          left = Math.min(d.clientWidth - node.clientWidth, left);
          top = Math.min(d.clientHeight - node.clientHeight, top);
          left = Math.max(0, left);
          top = Math.max(0, top);
          return { top, left }
          } }><p>{ChipText[ColorRef[i+j]][this.props.G.set]}</p></ReactTooltip>);
        }
      }
      else {
        for (let j = 1; j < 5; j++) {
          if (j !== 3) {
            let ttid = 1000+4*i+j;
            row.push(<td style={chipStyle(ColorRef[i],false)} onClick={() => {
                this.props.moves.buyChip(ColorRef[i],j);}} key={ttid}
                data-tip data-for={ttid.toString()}>
            {this.props.G.store[ColorRef[i]][j]}<br />
            ${this.props.G.storeCost[ColorRef[i]][j]}</td>);
            tooltips.push(<ReactTooltip id={ttid.toString()}
            overridePosition={ (
            { left, top },
            currentEvent, currentTarget, node) => {
            const d = document.documentElement;
            left = Math.min(d.clientWidth - node.clientWidth, left);
            top = Math.min(d.clientHeight - node.clientHeight, top);
            left = Math.max(0, left);
            top = Math.max(0, top);
            return { top, left }
            } }><p>{ChipText[ColorRef[i]][this.props.G.set]}</p></ReactTooltip>);
          }
        }
      }
      tstore.push(<tr>{row}</tr>);
      if (i === 2) {
        tstore.push(<tr><td textAlign='center'>1</td>
        <td textAlign='center'>2</td>
        <td textAlign='center'>4</td></tr>);
      }
    }
//Putting it all together
    return (
      <>
        <div>
        <h2>{winner}</h2>
          <table id="board">
            <thead display='block'><tr>
            <td colspan="5" width="150px" border="1px solid black">{theader}</td>
            <td colspan="3">{tplayer}</td>
              <td colspan="3">{tcard}</td>
              <td colspan="4">{tscoreboard}</td>
              <td colspan="3">{tstore}</td></tr></thead>
            <tbody display='block' colspan="18">{tbody}</tbody>
            <tfoot>{tooltips}</tfoot>
          </table>
        </div>
      </>
    );
  }
}
