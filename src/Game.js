//src/Game.js
import {INVALID_MOVE} from 'boardgame.io/core';
import {SetCost, NewStore, RatTails} from './Constants';
import {BGPActions, RedActionNumber} from './ChipActions';

const roundTurnOrder = {
  first: (G, ctx) => (G.round - 1) % ctx.numPlayers,
  next: (G, ctx) => {
    let p = ctx.playOrderPos; let n = ctx.numPlayers;
    if (p !== (((G.round - 1) % n) + n - 1) % n) {
      return (p + 1) % n;
    }
  },
};

const buy2Chip = {
  buy2ChipStage: {
    moves: {
      buyChip: (G, ctx, type, number) => {
        let p = parseInt(ctx.playerID);
        if (number !==2) {
          G.players[p] = messageOne(G.players[p],"You can only choose a 2-chip.");
          return INVALID_MOVE;
        }
        else if (G.store[type][number] < 1) {
          G.players[p] = messageOne(G.players[p],"None of these chips in the store.");
          return INVALID_MOVE;
        }
        else {
          G.players[p].bag.push(new Chip(type,number));
          G.store[type][number]--;
          G.players = messageAll(G.players, "Player "+ctx.playerID+" took a "+type+" "+number);
          ctx.events.endStage();
          G.cardStage++;
        }
      },
    }
  },
}

const cardStages = {
  justInTimeStage: { //Choose: Take 4 victory points OR remove 1 white 1-chip from your bag.
    moves: {
      takePoints: (G, ctx) => {
        let p = parseInt(ctx.playerID);
        G.score[p] += 4;
        G.players = messageAll(G.players, "Player "+p.toString()+" chose to take 4 points.");
        ctx.events.endStage();
        G.cardStage++;
      },
      removeChip: (G, ctx) => {
        let p = parseInt(ctx.playerID);
        G.players[p].bag.splice(G.players[p].bag.findIndex(element => (element.type==='white' && element.number===1)),1);
        G.players = messageAll(G.players, "Player "+p.toString()+" chose to remove a white 1-chip.");
        ctx.events.endStage();
        G.cardStage++;
      },
    },
  },
  chooseOneOfThreeStage: { //Choose: Take 1 black chip OR any one 2-chip OR 3 rubies.
    moves: {
      takeBlack: (G, ctx) => {
        let p = parseInt(ctx.playerID);
        if (G.store.black[1] < 1) {
          G.players = messageAll(G.players, "No more black chips remain.");;
        } else {
          G.players[p].bag.push(new Chip("black",1));
          G.store.black[1]--;
          G.players = messageAll(G.players, "Player "+p.toString()+" chose to take 1 black chip.");
          ctx.events.endStage();
          G.cardStage++;
        }
      },
      take2Chip: (G, ctx) => {
        let p = parseInt(ctx.playerID);
        G.players = messageAll(G.players, "Player "+p.toString()+" chose to take a 2-chip, please select which 2-chip you would like.");
        ctx.events.setStage('buy2ChipStage');
      },
      takeRubies: (G, ctx) => {
        let p = parseInt(ctx.playerID);
        G.players[p].rubies += 3;
        G.players = messageAll(G.players, "Player "+p.toString()+" chose to take 3 rubies.");
        ctx.events.endStage();
        G.cardStage++;
      },
    },
  },
  buy2Chip,
  ratsFriendsStage: { //Choose: Take any one 4-chip OR 1 victory point for each rat tail you get this turn.
    moves: {
      take4Chip: (G, ctx) => {
        let p = parseInt(ctx.playerID);
        G.players = messageAll(G.players, "Player "+p.toString()+" chose to take a 4-chip, please select which 4-chip you would like.");
        ctx.events.setStage('buy4ChipStage');
      },
      ratsForPoints: (G, ctx) => {
        let p = parseInt(ctx.playerID);
        let r = G.players[p].rats;
        G.score[p] += r;
        G.players = messageAll(G.players, "Player "+p.toString()+" chose to take "+r.toString()+" points.");
        ctx.events.endStage();
        G.cardStage++;
      },
    },
  },
  buy4ChipStage: {
    moves: {
      buyChip: (G, ctx, type, number) => {
        let p = parseInt(ctx.playerID);
        if (number !==4) {
          G.players[p] = messageOne(G.players[p],"You can only choose a 4-chip.");
          return INVALID_MOVE;
        }
        else if (G.store[type][number] < 1) {
          G.players[p] = messageOne(G.players[p],"None of these chips in the store.");
          return INVALID_MOVE;
        }
        else {
          G.players[p].bag.push(new Chip(type,number));
          G.store[type][number]--;
          G.players = messageAll(G.players, "Player "+ctx.playerID+" took a "+type+" "+number);
          ctx.events.endStage();
          G.cardStage++;
        }
      },
    }
  },
  goodStartStage: { //Choose: Use your rat stone normally OR pass up on 1-3 rat tails and take that many rubies (1-3) instead.
    moves: {
      ratsForRubies: (G, ctx, number) => {
        let p = parseInt(ctx.playerID);
        let r = G.players[p].rats;
        if (number > r) {
          G.players[p] = messageOne(G.players[p],"You do not have enough rat tails.");
          return INVALID_MOVE;
        }
        G.players[p].rats -= number;
        G.players = messageAll(G.players, "Player "+p.toString()+" chose to pass up on "+number.toString()+" rat rails for rubies.");
        ctx.events.endStage();
        G.cardStage++;
      },
    },
  },
  chooseWiselyStage: { //Choose: Move your droplet 2 spaces forward OR take 1 purple chip.
    moves: {
      takePurple: (G, ctx) => {
        let p = parseInt(ctx.playerID);
        if (G.store.purple[1] < 1) {
          G.players = messageAll(G.players, "No more purple chips remain.");;
        } else {
          G.players[p].bag.push(new Chip("purple",1));
          G.store.purple[1]--;
          G.players = messageAll(G.players, "Player "+p.toString()+" chose to take 1 purple chip.");
          ctx.events.endStage();
          G.cardStage++;
        }
      },
      moveDropTwice: (G, ctx) => {
        let p = parseInt(ctx.playerID);
        G.players[p] = advanceDrop(G.players[p]);
        G.players[p] = advanceDrop(G.players[p]);
        G.players = messageAll(G.players, "Player "+ctx.playerID+" advanced their droplet 2 spaces.");
        ctx.events.endStage();
        G.cardStage++;
      },
    },
  },
  wheelAndDealStage: { //You can trade 1 ruby for any one 1-chip (not purple or black).
    moves: {
      take1Chip: (G, ctx) => {
        let p = parseInt(ctx.playerID);
        let r = G.players[p].rubies;
        if (r < 1) {
          G.players[p] = messageOne(G.players[p],"Not enough rubies.");
          return INVALID_MOVE;
        }
        else {
          G.players[p].rubies--;
          G.players = messageAll(G.players, "Player "+p.toString()+" chose to trade a ruby for a 1-chip, please select which 1-chip you would like.");
          ctx.events.setStage('buy1ChipStage');
        }
      },
      doNothing: (G, ctx) => {
        let p = parseInt(ctx.playerID);
        G.players = messageAll(G.players, "Player "+p.toString()+" chose not to trade.");
        ctx.events.endStage();
        G.cardStage++;
      },
    },
  },
  buy1ChipStage: { //from wheelAndDealStage
    moves: {
      buyChip: (G, ctx, type, number) => {
        let p = parseInt(ctx.playerID);
        if (number !==1) {
          G.players[p] = messageOne(G.players[p],"You can only choose a 1-chip.");
          return INVALID_MOVE;
        }
        else if (type==='purple'||type==='black') {
          G.players[p] = messageOne(G.players[p],"You cannot choose a purple or black chip.");
          return INVALID_MOVE;
        }
        else if (G.store[type][number] < 1) {
          G.players[p] = messageOne(G.players[p],"None of these chips in the store.");
          return INVALID_MOVE;
        }
        else {
          G.players[p].bag.push(new Chip(type,number));
          G.store[type][number]--;
          G.players = messageAll(G.players, "Player "+ctx.playerID+" took a "+type+" "+number);
          ctx.events.endStage();
          G.cardStage++;
        }
      },
    }
  },
  opportunisticStage: { //Draw 4 chips from your bag.
    //You may trade in 1 of them for a chip of the same color with the next higher value.
    //If you can't make a trade, take 1 green 1-chip. Put all the chips back into the bag
    moves: {
      selectToUpgrade: (G, ctx, selected) => {
          let p = parseInt(ctx.playerID);
          let currentChip = G.players[p].selector.splice(selected,1)[0];
          let type = currentChip.type;
          let number = currentChip.number;
          let newnumber = number + 1;
          if (newnumber===3) {newnumber++;}
          if (type==="white"|type==="purple"|type==="orange"|type==="black"|number===4) {
            G.players[p] = messageOne(G.players[p],"Cannot trade in this chip.");
            G.players[p].selector.push(currentChip);
            return INVALID_MOVE;
          } else if (G.store[type][newnumber] < 1) {
            G.players[p] = messageOne(G.players[p],"None of the higher value chip in the store.");
            G.players[p].selector.push(currentChip);
            return INVALID_MOVE;
          } else {
          G.players[p].bag.push(new Chip(type,newnumber));
          G.store[type][newnumber]--;
          G.store[type][number]++;
          G.players[p].bag.splice(0,0,...G.players[p].selector.splice(0,G.players[p].selector.length));
          G.players = messageAll(G.players, "Player "+ctx.playerID+" traded for a "+type+" "+newnumber);
          ctx.events.endStage();
          G.cardStage++;
          }
        },
      selectNone: (G, ctx) => { //Theoretically this should only be allowed if you cannot make a trade
        let p = parseInt(ctx.playerID);
        G.players[p].bag.splice(0,0,...G.players[p].selector.splice(0,G.players[p].selector.length));
        if (G.store["green"][1] < 1) {
          G.players[p] = messageOne(G.players[p],"No green 1-chips in the store, sorry.");
        } else {
        G.players[p].bag.push(new Chip("green",1));
        G.store["green"][1]--;
        G.players = messageAll(G.players, "Player "+ctx.playerID+" took a green 1-chip");
        }
        ctx.events.endStage();
        G.cardStage++;
      },
    },
  },
  lessIsMoreStage: { //All players draw 5 chips. The player(s) with the lowest sum take(s) 1 blue 2-chip. All other players receive 1 ruby. Put all the chips back into the bag.
    moves: {
      lessIsMoreMove: (G, ctx) => {
        let p = parseInt(ctx.playerID);
        G.players[p].bag.splice(0,0,...G.players[p].selector.splice(0,G.players[p].selector.length));
        if (G.players[p].lessIsMoreWinner) {
          if (G.store["blue"][2] < 1) {
            G.players[p] = messageOne(G.players[p],"No blue 2-chips in the store, sorry, you get a ruby instead.");
            G.players[p].rubies++;
          } else {
          G.players[p].bag.push(new Chip("blue",2));
          G.store["blue"][2]--;
          G.players = messageAll(G.players, "Player "+ctx.playerID+" took a blue 2-chip");
          }
        } else {G.players[p].rubies++;}
        ctx.events.endStage();
        G.cardStage++;
      },
    },
  },

};

const selectorMoves = {
        selectToPot: (G, ctx, selected) => {
            let p = parseInt(ctx.playerID);
            let currentChip = G.players[p].selector.splice(selected,1)[0];
            G.players[p].bag.splice(0,0,...G.players[p].selector.splice(0,G.players[p].selector.length));
            ctx.events.endStage();
            G = playChip1(G, ctx, currentChip, p);
            if (G.players[p].secondChance&&(totalChips(G.players[p].pot)===5||G.players[p].whiteTotal > G.whiteMax)) {
              ctx.events.setStage('secondChanceStage');
              G.players[p].secondChance = currentChip;
            } else {
            G = playChip2(G, ctx, currentChip, p);
            }
          },
        selectNone: (G, ctx) => {
          let p = parseInt(ctx.playerID);
          G.players[p].bag.splice(0,0,...G.players[p].selector.splice(0,G.players[p].selector.length));
          if (ctx.phase==="strongIngredientPhase") {
            ctx.events.endTurn();
          } else {ctx.events.endStage();}
        },
      };

function isMax(currentValue,index,arr) {
	let maxScore = Math.max(...arr);
  	return (currentValue === maxScore);
}

function isMin(currentValue,index,arr) {
	let minScore = Math.min(...arr);
  	return (currentValue === minScore);
}

function isZero(currentValue) {
  	return (currentValue === 0);
}

function isDraw(score) {
  return (score.filter(isMax).length > 1);
}

function whoIsWinner(score) {
  if (isDraw(score)) {
    return {draw: true};
  }
  else {
    let maxScore = Math.max(...score);
    return {winner: score.indexOf(maxScore)};
  }
}

function addRats(G) {
  let maxScore = Math.max(...G.score);
  for (let i = 0; i < G.players.length; i++) {
    G.players[i].rats = RatTails.slice(G.score[i],maxScore).reduce(
      (acc, a) => acc + a,0);
    }
  return G;
}

function doubleRats(players) {
  for (let i = 0; i < players.length; i++) {
    players[i].rats *= 2;
    }
  return players;
}

function isWhite(spot) {
  if (spot.chip !== null) {
    return spot.chip.type==='white';
  }
}

function totalWhites(pot) {
  let whitePot = pot.filter(isWhite);
  let sum = 0;
  for (let i = 0; i < whitePot.length; i++) {
    sum += whitePot[i].chip.number;
  }
  return sum;
}

function isChip(spot) {
  let x = false;
  if (spot.chip !== null) {
    switch (spot.chip.type) {
      case 'orange': x = true; break;
      case 'black': x = true; break;
      case 'purple': x = true; break;
      case 'green': x = true; break;
      case 'blue': x = true; break;
      case 'red': x = true; break;
      case 'yellow': x = true; break;
      case 'white': x = true; break;
      default: x = false;
    }
  }
  return x;
}

function totalChips(pot) {
  return pot.filter(isChip).length;
}

function spotFilled(spot) {
  return spot.chip !== null;
}
export function lastFilled(pot) {
  return pot.indexOf(pot.slice().reverse().find(spotFilled));
}
function isDrop(spot) {
  return spot.chip ? spot.chip.number==='drop' : false;
}

function advanceDrop(player) {
  let dSpot = player.pot.find(isDrop);
  let dIndex = player.pot.indexOf(dSpot);
  if (dIndex === 51) {return player;} //cannot advance drop too far
  let tempChip = player.pot.slice()[dIndex + 1].chip;
  if (tempChip&&tempChip.number!=='rat') {player.bag.push(tempChip);}
  player.pot[dIndex + 1].chip = dSpot.chip;
  player.pot[dIndex].chip = null;
  return player;
}

function addScore(G) {
  for (let i = 0; i < G.players.length; i++) {
    if (G.players[i].pointsOrCoins!=='coins') {
      G.score[i] +=
      G.players[i].pot[lastFilled(G.players[i].pot)+1].points;
    }
  }
  return G;
}

function clearChips(players) {
  for (let i = 0; i < players.length; i++) {
    let lastChip = {...players[i].pot[lastFilled(players[i].pot)].chip};
    while (lastChip.number!=='drop') {
      if (lastChip.number!=='rat') {players[i].bag.push(lastChip);}
      players[i].pot[lastFilled(players[i].pot)].chip = null;
      lastChip = {...players[i].pot[lastFilled(players[i].pot)].chip};
    }
    players[i].whiteTotal = 0;
    players[i].playerCoins = 0;
    players[i].rats = 0;
    players[i].exploded = false;
    players[i].bought = '';
    players[i].pointsOrCoins = '';
    players[i].bonus = false;
    players[i].lessIsMoreWinner = false;
    players[i].wellStirredUsed = false;
  }
  return players;
}

function playChip1(G, ctx, currentChip, p) {
  let actionNumber = 0;
  let f = lastFilled(G.players[p].pot);
  if (currentChip.type==='red') {
    actionNumber = RedActionNumber[G.set](G, ctx);}
  else if (currentChip.type==='orange' && G.currCard===15) {
    actionNumber = 1;}
  else if (currentChip.type==='yellow') {
    if (G.set===1) {
      let lastChip = {...G.players[p].pot[f].chip};
      if (lastChip.type==='white') {
        G.players[p].bag.push(lastChip);
        G.players[p].pot[f].chip = null;
      }
    }
  }
  else if (currentChip.type==='white' && G.currCard===21 && !G.players[p].wellStirredUsed) {
    ctx.events.setStage('wellStirredStage');
  }
  let a = f+currentChip.number+actionNumber;
  //console.log(currentChip); console.log(f); console.log(actionNumber);
  //console.log("index of next chip is "+a);
  if (a > 52) {a = 52;}
  G.players[p].pot[a].chip = currentChip;
  //console.log("drew a chip");
  G.players[p].whiteTotal = totalWhites(G.players[p].pot);
  return G;
}
function playChip2(G, ctx, currentChip, p) {
  if (G.players[p].whiteTotal > G.whiteMax) {
    ctx.events.endStage();
    G.playersToDraw--;
    //console.log("pot exploded!");
    G.players[p].exploded = true;
  } else if (lastFilled(G.players[p].pot) === 52) {
    ctx.events.endStage();
    G.playersToDraw--;
  } else if (currentChip.type==='blue') {
    if (G.set===1) {
      let n = currentChip.number;
      G.players[p].bag = ctx.random.Shuffle(G.players[p].bag);
      for (let i = 0; i < n; i++) {
        if (G.players[p].bag.length > 0) {
        G.players[p].selector.push(G.players[p].bag.pop());}
      }
      if (ctx.phase!=="strongIngredientPhase")
        {ctx.events.setStage('selectStage');}
    }
  } else if (ctx.phase==="strongIngredientPhase") {
    ctx.events.endTurn(); //might need to change if logic for this
  }
  return G;
}

function strongIngredient(G, ctx, p) { //Beginning with the start player, if you stopped without an explosion, draw up to 5 chips from your bag. You may place 1 of them in your pot.
  G.players[p].bag = ctx.random.Shuffle(G.players[p].bag);
  for (let i = 0; i < 5; i++) {
    if (G.players[p].bag.length > 0) {
    G.players[p].selector.push(G.players[p].bag.pop());}
  }
  return G;
}

function getsBonus(players) {
  let scoreSpot = new Array(players.length);
  for (let i = 0; i < players.length; i++) {
    scoreSpot[i] = players[i].exploded ? 0 : lastFilled(players[i].pot)+1;
  }
  if (scoreSpot.every(isZero)) {return players;}
  let winsBonus = scoreSpot.map(isMax);
  for (let i = 0; i < players.length; i++) {
    players[i].bonus = winsBonus[i];
  }
  return players;
}


export function messageAll(players, message) {
  for (let i = 0; i < players.length; i++) {
    players[i].message.push(""+message);
    if (players[i].readLast) {
      players[i].readLast = false;
      players[i].unreadMessages = 0;
    }
    players[i].unreadMessages++;
  }
  return players;
}

export function messageOne(player, message) {
    player.message.push(""+message);
    if (player.readLast) {
      player.readLast = false;
      player.unreadMessages = 0;
    }
    player.unreadMessages++;
  return player;
}

function messagesRead(players) {
  for (let i = 0; i < players.length; i++) {
    players[i].readLast = true;
  }
  return players;
}

function dieRoll(G, d, p) {
  if (d===1||d===2) {
    G.score[p]++;
    G.players = messageAll(G.players, "Player "+p.toString()+" received 1 point from the bonus die.");}
  if (d===3) {
    G.score[p] += 2;
    G.players = messageAll(G.players, "Player "+p.toString()+" received 2 points from the bonus die.");}
  if (d===4) {
    G.players[p].rubies++;
    G.players = messageAll(G.players, "Player "+p.toString()+" received 1 ruby from the bonus die.");}
  if (d===5) {
    G.players[p].bonusDieDrop++;
    G.players = messageAll(G.players, "Player "+p.toString()+" advanced their droplet from the bonus die, this will take effect after the black/green/purple chip actions are processed.");}
  if (d===6) {
    G.players[p].bag.push(new Chip("orange",1));
    G.store.orange[1]--;
    G.players = messageAll(G.players, "Player "+p.toString()+" received 1 orange 1 chip from the bonus die.");}
  return G;
}

function purpleCards (G, ctx) {
  if (G.currCard===1) { //Everyone rolls the die once and gets the bonus shown.
    for (let i = 0; i < G.players.length; i++) {
      let d = ctx.random.D6();
      G = dieRoll (G, d, i);
    }
  }
  else if (G.currCard===2) { //Move your droplet one space forward.
    for (let i = 0; i < G.players.length; i++) {
      G.players[i] = advanceDrop(G.players[i]);
    }
  }
  else if (G.currCard===3) { //The player(s) with the fewest rubies receive(s) 1 ruby.
    let rubyArr = new Array(G.players.length);
    for (let i = 0; i < G.players.length; i++) {
      rubyArr[i] = G.players[i].rubies;
    }
    let winsRuby = rubyArr.map(isMin);
    for (let i = 0; i < G.players.length; i++) {
      if (winsRuby[i]) {G.players[i].rubies++;}
    }
  }
  else if (G.currCard===4) { //Double the number of rat tails in this round.
    G.players = doubleRats(G.players);
  }
  else if (G.currCard===5) { //The player(s) with the fewest victory points receive(s) 1 green 1-chip.
    let lowScore = G.score.map(isMin);
    for (let i = 0; i < G.players.length; i++) {
      if (lowScore[i]) {
        if (G.store.green[1] < 1) {
          G.players = messageAll(G.players, "No more green 1-chips remain.");;
        } else {
        G.players[i].bag.push(new Chip("green",1));
        G.store.green[1]--;
        G.players = messageAll(G.players, "Player "+i+" received a green 1-chip.");
        }
      }
    }
  }
  else if (G.currCard===20) { //The threshold for white chips is raised in this round from 7 to 9.
    G.whiteMax = 9;
  } else if (G.currCard===24) { //After you have placed the first 5 chips in your pot, choose to continue OR begin the round all over again - but you get this choice only once
    for (let i = 0; i < G.players.length; i++) {
      G.players[i].secondChance = true
    }
  }
  return G;
}

export class Chip {
  constructor(type, number) {
    this.type = type;
    this.number = number;
  }
}

class Spot {
  constructor(id,coins,points,ruby) {
    this.id = id;
    this.coins = coins;
    this.points = points;
    this.ruby = ruby;
    this.chip = null;
  }
}

class Player {
  constructor(id) {
  this.id = id;
  this.bag = [new Chip('white',1),
        new Chip('white',1),
        new Chip('white',1),
        new Chip('white',1),
        new Chip('white',2),
        new Chip('white',2),
        new Chip('white',3),
        new Chip('orange',1),
        new Chip('green',1)];
  this.pot = [new Spot(0,0,0,false),
              new Spot(1,1,0,false),
              new Spot(2,2,0,false),
              new Spot(3,3,0,false),
              new Spot(4,4,0,false),
              new Spot(5,5,0,true),
              new Spot(6,6,1,false),
              new Spot(7,7,1,false),
              new Spot(8,8,1,false),
              new Spot(9,9,1,true),
              new Spot(10,10,2,false),
              new Spot(11,11,2,false),
              new Spot(12,12,2,false),
              new Spot(13,13,2,true),
              new Spot(14,14,3,false),
              new Spot(15,15,3,false),
              new Spot(16,15,3,true),
              new Spot(17,16,3,false),
              new Spot(18,16,4,false),
              new Spot(19,17,4,false),
              new Spot(20,17,4,true),
              new Spot(21,18,4,false),
              new Spot(22,18,5,false),
              new Spot(23,19,5,false),
              new Spot(24,19,5,true),
              new Spot(25,20,5,false),
              new Spot(26,20,6,false),
              new Spot(27,21,6,false),
              new Spot(28,21,6,true),
              new Spot(29,22,7,false),
              new Spot(30,22,7,true),
              new Spot(31,23,7,false),
              new Spot(32,23,8,false),
              new Spot(33,24,8,false),
              new Spot(34,24,8,true),
              new Spot(35,25,9,false),
              new Spot(36,25,9,true),
              new Spot(37,26,9,false),
              new Spot(38,26,10,false),
              new Spot(39,27,10,false),
              new Spot(40,27,10,true),
              new Spot(41,28,11,false),
              new Spot(42,28,11,true),
              new Spot(43,29,11,false),
              new Spot(44,29,12,false),
              new Spot(45,30,12,false),
              new Spot(46,30,12,true),
              new Spot(47,31,12,false),
              new Spot(48,31,13,false),
              new Spot(49,32,13,false),
              new Spot(50,32,13,true),
              new Spot(51,33,14,false),
              new Spot(52,33,14,true),
              new Spot(53,35,15,false),
              ];
  this.pot[0].chip = new Chip(id.toString(),'drop')
  this.whiteTotal = 0;
  this.rubies = 1;
  this.exploded = false;
  this.flaskFull = true;
  this.playerCoins = 0;
  this.bought = '';
  this.rats = 0;
  this.pointsOrCoins = '';
  this.message = [''];
  this.unreadMessages = 0;
  this.readLast = false;
  this.bonus = false;
  this.selector = [];
  this.savedReds = [];
  this.bonusDieDrop = 0;
  this.lessIsMoreWinner = false;
  this.wellStirredUsed = false;
  this.secondChance = false;
  }
}

function createPlayers(num) {
  //console.log("Creating ", num, " player game");
  let players = [];
  for (let k = 0; k < num; k++) {
    players.push(new Player(k));
  }
  return players;
}


export const Quacks = {
  name: 'Quacks',
  setup: (ctx) => ({
    players: createPlayers(ctx.numPlayers),
    score: new Array(ctx.numPlayers).fill(0),
    store: NewStore,
    playersToDraw: ctx.numPlayers,
    set: 1,
    storeCost: SetCost[1],
    deck: [...Array(25).keys()].slice(1),
    round: 0,
    currCard: 0,
    whiteMax: 7,
    cardStage: 0,
  }),
  turn: {
    order: roundTurnOrder,
  },
  phases: {
    cardPhase: {
      next: 'drawPhase',
      onBegin: (G, ctx) => {
        G.round++;
        //console.log("card phase started");
        if (G.round < 10) {
          G.players = messageAll(G.players, "Round "+G.round+" is beginning.");
          G.players = messageAll(G.players, "Player "+((G.round - 1) % ctx.numPlayers)+
          " starts this round by drawing a card.");}
        if (G.round===1) {
          G.players = messageAll(G.players, "Each player's bag starts with 1 green 1-chip, 1 orange 1-chip, 4 white 1-chips, 2 white 2-chips, and 1 white 3-chip.");}
        if (G.round===2) {
          G.store.yellow = {1: 13, 2: 6, 4: 10};
          G.players = messageAll(G.players, "Yellow chips are available for purchase this round.");}
        if (G.round===3) {
          G.store.purple = {1: 15};
          G.players = messageAll(G.players, "Purple chips are available for purchase this round.");}
        if (G.round===6) {
          for (let i = 0; i < G.players.length; i++) {
            G.players[i].bag.push(new Chip('white',1));
          }
          G.players = messageAll(G.players, "Each player receives an additional white 1-chip this round.");
        }
        G = addRats(G);
        G.players = messageAll(G.players, "Card phase has begun.");
        G.players = messagesRead(G.players);
      },
      onEnd: (G, ctx) => {
        G = purpleCards(G, ctx);
        G.cardStage = 0;
      },
      endIf: (G,ctx) => (G.cardStage===ctx.numPlayers),
      moves: {
        drawCard: (G, ctx) => {
          G.deck = ctx.random.Shuffle(G.deck);
          let c = G.deck.pop();
          G.currCard = c;
          if (c===6){
            ctx.events.setActivePlayers({all: 'justInTimeStage'});
          } else if (c===7) {
            ctx.events.setActivePlayers({all: 'chooseOneOfThreeStage'});
          } else if (c===8) {
            ctx.events.setActivePlayers({all: 'ratsFriendsStage'});
          } else if (c===9) {
            ctx.events.setActivePlayers({all: 'goodStartStage'});
          } else if (c===10) {
            ctx.events.setActivePlayers({all: 'chooseWiselyStage'});
          } else if (c===11) {
            ctx.events.setActivePlayers({all: 'wheelAndDealStage'});
          } else if (c===12) {
            for (let j = 0; j < G.players.length; j++) {
              G.players[j].bag = ctx.random.Shuffle(G.players[j].bag);
              for (let i = 0; i < 4; i++) {
                G.players[j].selector.push(G.players[j].bag.pop());
              }
            }
            ctx.events.setActivePlayers({all: 'opportunisticStage'});
          } else if (c===13) {
            for (let j = 0; j < G.players.length; j++) {
              G.players[j].bag = ctx.random.Shuffle(G.players[j].bag);
              for (let i = 0; i < 5; i++) {
                G.players[j].selector.push(G.players[j].bag.pop());
              }
            }
            let selectorTotal = G.players.map(pl => pl.selector.reduce((a,b) => a + b.number, 0));
            let lowestSum = selectorTotal.map(isMin);
            for (let j = 0; j < G.players.length; j++) {
              G.players[j].lessIsMoreWinner = lowestSum[j];
            }
            ctx.events.setActivePlayers({all: 'lessIsMoreStage'});
          } else
          {ctx.events.endPhase();}
        },
      },
      start: true,
      turn: {
        stages: cardStages,
        order: roundTurnOrder,
      },
    },
    drawPhase: {
      next: 'strongIngredientPhase',
      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({all: 'ratStage'});
        //console.log("draw phase started");
        G.players = messageAll(G.players, "Draw phase has begun! Take your rats and then click your Bag to draw.");
        G.players = messagesRead(G.players);
        },
      endIf: (G,ctx) => (G.playersToDraw<1 && !ctx.activePlayers),
      turn: {
        stages: {
          ratStage:{
            next: 'drawStage',
            moves: {
              useRats: (G, ctx) => {
                if (G.players[parseInt(ctx.playerID)].rats > 0) {
                  let newRat = new Chip(ctx.playerID,'rat');
                  G.players[parseInt(ctx.playerID)].pot[lastFilled(G.players[parseInt(ctx.playerID)].pot)
                    +G.players[parseInt(ctx.playerID)].rats].chip = newRat;
                }
                ctx.events.setStage('drawStage');
              }
            }
          },
          drawStage: {
            moves: {
              drawFromBag:  {
                move:(G, ctx) => {
                  let p = parseInt(ctx.playerID);
                  G.players[p].bag = ctx.random.Shuffle(G.players[p].bag);
                  let currentChip = G.players[p].bag.pop();
                  G = playChip1(G, ctx, currentChip, p);
                  if (G.players[p].secondChance&&(totalChips(G.players[p].pot)===5||G.players[p].whiteTotal > G.whiteMax)) {
                    ctx.events.setStage('secondChanceStage');
                    G.players[p].secondChance = currentChip;
                  } else {
                  G = playChip2(G, ctx, currentChip, p);
                  }
                },
                undoable: false,
              },
              stopDrawing1: (G,ctx) => {
                ctx.events.setStage('stopDrawingStage');
              },
              useFlask: (G, ctx) => {
                let p = parseInt(ctx.playerID);
                let lastChip = {...G.players[p].pot[lastFilled(G.players[p].pot)].chip};
                if (!(lastChip.type==='white' && G.players[p].flaskFull)) {
                      G.players[p] = messageOne(G.players[p],"Invalid move.");
                      return INVALID_MOVE;
                    }
                G.players[p].bag.push(lastChip);
                G.players[p].pot[lastFilled(
                  G.players[p].pot)].chip = null;
                G.players[p].flaskFull = false;
                G.players[p].whiteTotal = totalWhites(G.players[p].pot);
              },
            },
          },
          stopDrawingStage: {
            moveLimit: 1,
            moves: {
              stopDrawing2: (G,ctx) => {
                if (G.currCard===22) {
                  G = strongIngredient(G,ctx,parseInt(ctx.playerID));
                }
                ctx.events.endStage();
                G.playersToDraw--;
              },
              keepDrawing: (G,ctx) => {
                ctx.events.setStage('drawStage');
              },
            }
          },
          selectStage: {
            moveLimit: 1,
            moves: selectorMoves,
            next: 'drawStage'
          },
          secondChanceStage: { //After you have placed the first 5 chips in your pot, choose to continue OR begin the round all over again - but you get this choice only once
            moves: {
              secondChanceYes: (G, ctx) => {
                let p = parseInt(ctx.playerID);
                let lastChip = {...G.players[p].pot[lastFilled(G.players[p].pot)].chip};
                while (lastChip.number!=='drop'&&lastChip.number!=='rat') {
                  G.players[p].bag.push(lastChip);
                  G.players[p].pot[lastFilled(G.players[p].pot)].chip = null;
                  lastChip = {...G.players[p].pot[lastFilled(G.players[p].pot)].chip};
                }
                G.players[p].whiteTotal = 0;
                if (G.set===1 && G.players[p].selector.length > 0) {
                  G.players[p].bag.splice(0,0,...G.players[p].selector.splice(0,G.players[p].selector.length));
                }
                ctx.events.setStage('drawStage');
                G.players[p].secondChance = false;
                G.players = messageAll(G.players, "Player "+p.toString()+" took a second chance.");
              },
              secondChanceNo: (G, ctx) => {
                let p = parseInt(ctx.playerID);
                ctx.events.setStage('drawStage');
                G = playChip2(G, ctx, {...G.players[p].secondChance}, p);
                G.players[p].secondChance = false;
                G.players = messageAll(G.players, "Player "+p.toString()+" did not take a second chance.");
              },
            },
          },
          wellStirredStage: { //In this round, you may put the first white chip you draw back into the bag.
            next: 'drawStage',
            moveLimit: 1,
            moves: {
              wellStirredYes: (G, ctx) => {
                let p = parseInt(ctx.playerID);
                let lastChip = {...G.players[p].pot[lastFilled(G.players[p].pot)].chip};
                if (!(lastChip.type==='white')) {
                      G.players[p] = messageOne(G.players[p],"Invalid move.");
                      return INVALID_MOVE;
                    }
                G.players[p].bag.push(lastChip);
                G.players[p].pot[lastFilled(
                  G.players[p].pot)].chip = null;
                G.players[p].whiteTotal = totalWhites(G.players[p].pot);
                ctx.events.setStage('drawStage');
                G.players[p].wellStirredUsed = true;
              },
              wellStirredNo: (G, ctx) => {
                let p = parseInt(ctx.playerID);
                ctx.events.setStage('drawStage');
                G.players[p].wellStirredUsed = true;
              },
            },
          }
        },
      },
    },
    strongIngredientPhase: { //Beginning with the start player, if you stopped without an explosion, draw up to 5 chips from your bag. You may place 1 of them in your pot.
      next: 'schadenfreudePhase',
      onBegin: (G, ctx) => {
        //console.log("draw phase ended");
        if (G.currCard===22) {
          G.players = messageAll(G.players, "Players who stopped without an explosion will now draw up to 5 chips.");
          G.players = messagesRead(G.players);
          }
        },
      moves: selectorMoves,
      turn: {
        order: roundTurnOrder,
        //moveLimit: 1,
        },
      endIf: (G, ctx) => (G.currCard!==22),
      },
    schadenfreudePhase: { //If your pot explodes this round, the player to your left (before you) gets any one 2-chip.
        next: 'bonusPhase',
        onBegin: (G, ctx) => {
          //console.log("draw phase ended");
          if (G.currCard===23) {
            G.players = messageAll(G.players, "If your pot explodes this round, the player to your left (after you) gets any one 2-chip.");
            G.players = messagesRead(G.players);
            let n = G.players.length;
            let activePlayerList = {};
            for (let i = 0; i < n; i++) {
              if (G.players[(i+n-1)%n].exploded) {
                activePlayerList[i.toString()] = { stage: 'buy2ChipStage',};
                } else {
                G.cardStage++;
                }
              }
            ctx.events.setActivePlayers({
              value: activePlayerList
              });
            }
          },
        turn: {
          stages: buy2Chip,
        },
        endIf: (G, ctx) => (G.currCard!==23||G.cardStage===ctx.numPlayers),
        onEnd: (G, ctx) => {G.cardStage = 0;}
      },
    bonusPhase: {
      next: 'actionPhase',
      onBegin: (G, ctx) => {
        //console.log("bonus phase started");
        if (G.currCard===19) {
          for (let i = 0; i < G.players.length; i++) {
            if (G.players[i].whiteTotal===7) {
              G.players[i].bonusDieDrop++;
              G.players = messageAll(G.players, "Player "+i.toString()+" advanced their droplet from have white chips total exactly 7, this will take effect after the black/green/purple chip actions are processed.");}
            }
          }
        G.players = getsBonus(G.players);
        G.players = messageAll(G.players, "Bonus die phase has begun!");
        G.players = messagesRead(G.players);
        },
      moves: {
        rollDie: (G, ctx) => {
          let p = parseInt(ctx.playerID);
          if (!G.players[p].bonus) {return INVALID_MOVE;}
          let d = ctx.random.D6();
          G = dieRoll (G, d, p);
          if (G.currCard === 14) {
            let d = ctx.random.D6();
            G = dieRoll (G, d, p);
          }
        },
        noBonus: (G, ctx) => {},
        },
      turn: {
        order: roundTurnOrder,
        moveLimit: 1,
        },
      },
    actionPhase:{
      next: 'rubyPhase',
      onBegin: (G, ctx) => {
        //console.log("action phase started");
        },
      endIf: (G, ctx) => (true),
    },
    rubyPhase: {
      next: 'pointPhase',
      onBegin: (G, ctx) => {
        //console.log("action phase started");
        G = BGPActions.black(G, ctx);
        G = BGPActions.green[G.set](G, ctx);
        G = BGPActions.purple[G.set](G, ctx);
        for (let i = 0; i < G.players.length; i++) {
          while (G.players[i].bonusDieDrop > 0) {
            G.players[i] = advanceDrop(G.players[i]);
            G.players[i].bonusDieDrop--;
          }
        }
        G.players = messagesRead(G.players);
        //console.log("ruby phase started");
        },
      moves: {
        takeRubies: (G, ctx) => {
          let p = parseInt(ctx.playerID);
          if (G.players[p].pot[lastFilled(G.players[p].pot)+1].ruby) {
            if (G.currCard===16) {
              G.players[p].rubies++;
              G.score[p] += 2;
              G.players[p] = messageOne(G.players[p],"You received a ruby and 2 points.");
            } else if (G.currCard===17) {
              G.players[p].rubies += 2;
              G.players[p] = messageOne(G.players[p],"You received two rubies.");
            } else {
              G.players[p].rubies++;
              G.players[p] = messageOne(G.players[p],"You received a ruby.");
            }
          }
          else {G.players[p] = messageOne(G.players[p],"You did not receive a ruby.");}
        }
      },
      turn: {
        order: roundTurnOrder,
        moveLimit: 1,
      },
    },
    pointPhase: {
      next: 'buyPhase',
      onBegin: (G, ctx) => {
        G.players = messagesRead(G.players);
        //console.log("point phase started");
      },
      onEnd: (G, ctx) => {
        G = addScore(G);
        G.players = messagesRead(G.players);
      },
      moves: {
        choosePoints: (G, ctx) => {
          G.players[parseInt(ctx.playerID)].pointsOrCoins = 'points';
          G.players = messageAll(G.players, "Player "+ctx.playerID+" chose points.");
        },
        chooseCoins: (G, ctx) => {
          G.players[parseInt(ctx.playerID)].pointsOrCoins = 'coins';
          G.players = messageAll(G.players, "Player "+ctx.playerID+" chose coins.");
        },
        takePoints: (G, ctx) => {},
      },
      turn: {
        order: roundTurnOrder,
        moveLimit: 1,
      },
    },
    buyPhase: {
      next: 'endPhase',
      onBegin: (G, ctx) => {
        //console.log("buy phase started");
        for (let i = 0; i < G.players.length; i++) {
          if (G.players[i].pointsOrCoins!=='points') {
            G.players[i].playerCoins = G.players[i].pot[lastFilled(G.players[i].pot)+1].coins;
          }
        }
        G.players = messageAll(G.players, "Buy Phase: click on chips in the Store to buy up to 2, click Done Buying if not buying 2.");
        G.players = messagesRead(G.players);
      },
      turn: {
        order: roundTurnOrder,
        moveLimit: 2,
      },
      moves:{
        buyChip: (G, ctx, type, number) => {
          let p = parseInt(ctx.playerID);
          let money = G.players[parseInt(ctx.playerID)].playerCoins;
          let chipCost = G.storeCost[type][number];
          if (chipCost > money) {
            G.players[p] = messageOne(G.players[p],"Not enough coins.");
            return INVALID_MOVE;
          } else if (G.store[type][number] < 1) {
            G.players[p] = messageOne(G.players[p],"None of these chips in the store.");
            return INVALID_MOVE;
          } else if (type === G.players[parseInt(ctx.playerID)].bought) {
            G.players[p] = messageOne(G.players[p],"Cannot buy two chips of the same color in one turn.");
            return INVALID_MOVE;
          }
          else {
            G.players[parseInt(ctx.playerID)].bag.push(new Chip(type,number));
            G.store[type][number]--;
            G.players[parseInt(ctx.playerID)].playerCoins -= chipCost;
            G.players[parseInt(ctx.playerID)].bought = type;
            G.players = messageAll(G.players, "Player "+ctx.playerID+" bought a "+type+" "+number);
          }
        },
        doneBuying: (G, ctx) => {},
        coinsToPoints: (G, ctx) => {
          let p = parseInt(ctx.playerID);
          let m = Math.floor(G.players[p].playerCoins / 5)
          if (m < 1) {
            G.players[p] = messageOne(G.players[p],"Not enough money.");
            return INVALID_MOVE;
          }
          G.score[p]+= m;
          G.players[p].playerCoins -= m*5;
          G.players = messageAll(G.players, "Player "+ctx.playerID+" bought "+m+" points for "+m*5+" coins.");
        },
      },
    },
    endPhase: {
      next: 'cardPhase',
      onBegin: (G, ctx) => {
        //console.log("end phase started");
        if (G.currCard===18) {
          for (let i = 0; i < G.players.length; i++) {
            G.players[i].flaskFull = true
          }
          G.players = messageAll(G.players, "All flasks have been refilled for free.");
        }
        G.players = messagesRead(G.players);
        },
      onEnd: (G,ctx) => {
        G.players = clearChips(G.players);
        G.playersToDraw = ctx.numPlayers;
        G.whiteMax = 7;
        G.players = messagesRead(G.players);
        //console.log("end phase ended");
        },
      turn: {
        order: roundTurnOrder,
      },
      moves:{
        fillFlask: (G, ctx) => {
          let p = parseInt(ctx.playerID);
          let r = G.players[p].rubies;
          let f = G.players[p].flaskFull;
          if (r < 2 ) {
            G.players[p] = messageOne(G.players[p],"Not enough rubies.");
            return INVALID_MOVE;
            }
          else if (f) {
            G.players[p] = messageOne(G.players[p],"Flask is already full.");
            return INVALID_MOVE;
            }
          else {
            G.players[p].rubies = G.players[p].rubies - 2;
            G.players[p].flaskFull = true;
            G.players = messageAll(G.players, "Player "+ctx.playerID+" filled their flask for 2 rubies.");
            }
          },
        moveDrop: (G, ctx) => {
          let p = parseInt(ctx.playerID);
          let r = G.players[p].rubies;
          if (r < 2 ) {
            G.players[p] = messageOne(G.players[p],"Not enough rubies.");
            return INVALID_MOVE;
            }
          else {
            G.players[p].rubies = G.players[p].rubies - 2;
            G.players[p] = advanceDrop(G.players[p]);
            G.players = messageAll(G.players, "Player "+ctx.playerID+" advanced their droplet for 2 rubies.");
            }
          },
          rubiesToPoints: (G, ctx) => {
            let p = parseInt(ctx.playerID);
            let r = G.players[p].rubies;
            if (r < 2 ) {
              G.players[p] = messageOne(G.players[p],"Not enough rubies.");
              return INVALID_MOVE;
              }
            else {
              G.players[p].rubies = G.players[p].rubies - 2;
              G.score[p]++;
              G.players = messageAll(G.players, "Player "+ctx.playerID+" bought 1 point for 2 rubies.");
              }
            },
        },
      },
    },
  minPlayers: 2,
  maxPlayers: 4,
  endIf: (G, ctx) => {
    if (G.round===10) {
      return whoIsWinner(G.score);
    }
  },
};
