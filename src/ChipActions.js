//src/ChipActions.js

import {lastFilled, messageAll, Chip} from './Game';

function isBlack(spot) {
  if (spot.chip !== null) {
    return spot.chip.type==='black';
  }
}

function totalBlacks(pot) {
  let blackPot = pot.filter(isBlack);
  return blackPot.length;
}

function isGreen(spot) {
  if (spot) {
    if (spot.chip !== null) {
    return spot.chip.type==='green';
  } }
}

function isPurple(spot) {
  if (spot.chip !== null) {
    return spot.chip.type==='purple';
  }
}

function totalPurples(pot) {
  let purplePot = pot.filter(isPurple);
  return purplePot.length;
}

function isOrange(spot) {
  if (spot.chip !== null) {
    return spot.chip.type==='orange';
  }
}

function totalOranges(pot) {
  let orangePot = pot.filter(isOrange);
  return orangePot.length;
}

export const BGPActions = {
  black: (G, ctx) => {
    let n = ctx.numPlayers;
    if (n===2) {
      if (totalBlacks(G.players[0].pot)===totalBlacks(G.players[1].pot)) {
        if (totalBlacks(G.players[0].pot) > 0) {
        G.players[0].bonusDieDrop++;
        G.players[1].bonusDieDrop++;
        G.players = messageAll(G.players, "Equal black chips, both players advance drop.");}
      } else if (totalBlacks(G.players[0].pot) > totalBlacks(G.players[1].pot)) {
        G.players[0].bonusDieDrop++;
        G.players[0].rubies++;
        G.players = messageAll(G.players, "Player 0 has the most black chips, advances drop + 1 ruby.");
      } else {
        G.players[1].bonusDieDrop++;
        G.players[1].rubies++;
        G.players = messageAll(G.players, "Player 1 has the most black chips, advances drop + 1 ruby.");
      }
    } else {
      let blackNumbers = G.players.map(player => totalBlacks(player.pot))
      for (let i = 0; i < n; i++) {
        if (blackNumbers[i] > blackNumbers[(i+1)%n] ||
        blackNumbers[i] > blackNumbers[(i-1+n)%n]) {
          G.players[i].bonusDieDrop++;
          G.players = messageAll(G.players, "Player "+i+" has more black chips than at least one neighbor, advances drop.");
        }
        if (blackNumbers[i] > blackNumbers[(i+1)%n] &&
        blackNumbers[i] > blackNumbers[(i-1+n)%n]) {
          G.players[i].rubies++;
          G.players = messageAll(G.players, "Player "+i+" has more black chips than both neighbors, receives 1 ruby.");
        }
      }
    }
    return G;
  },
  green: {
    1: (G, ctx) => {
      for (let i = 0; i < ctx.numPlayers; i++) {
        let lastSpot = new Array(2);
        lastSpot[0] = {...G.players[i].pot[lastFilled(G.players[i].pot)]};
        let secondPot = G.players[i].pot.slice(0,lastFilled(G.players[i].pot));
        lastSpot[1] = secondPot[lastFilled(secondPot)];
        let g = lastSpot.filter(isGreen).length
        if (g > 0) {G.players[i].rubies += g;
        G.players = messageAll(G.players, "Player "+i+" received "+g+" rubies from green chips.");}
      }
      return G;
    },
    2: (G, ctx) => {
      for (let i = 0; i < ctx.numPlayers; i++) {
        let lastSpot = new Array(2);
        lastSpot[0] = {...G.players[i].pot[lastFilled(G.players[i].pot)]};
        let secondPot = G.players[i].pot.slice(0,lastFilled(G.players[i].pot));
        lastSpot[1] = secondPot[lastFilled(secondPot)];
        for (let j = 0; j < 2; j++) {
          if (isGreen(lastSpot[j])) {
            switch (lastSpot[j].chip.number) {
              case "1":
                G.players[i].bag.push(Chip('orange','1'));
                G.players = messageAll(G.players, "Player "+i+" received an orange 1 chip because of a green 1.");
                break;
              case "2":
                G.players[i].bag.push(Chip('blue','1')); //need to make optional blue/red
                G.players = messageAll(G.players, "Player "+i+" received a blue 1 chip because of a green 2.");
                break;
              case "4":
                G.players[i].bag.push(Chip('purple','1')); //need to make optional purple/yellow
                G.players = messageAll(G.players, "Player "+i+" received a purple 1 chip because of a green 4.");
                break;
              default:
                G.players = messageAll(G.players, "Player "+i+" has a green chip with an invalid number.");
            }
          }
        }
      }
      return G;
    },
    3: {},
    4: {},
  },
  purple: {
    1: (G, ctx) => {
      for (let i = 0; i < ctx.numPlayers; i++) {
        if (totalPurples(G.players[i].pot) > 2) {
          G.score[i] += 2;
          G.players[i].bonusDieDrop++;
          G.players = messageAll(G.players, "Player "+i+" has 3 or more purple chips, +2 points +1 drop");
        } else if (totalPurples(G.players[i].pot) === 2) {
          G.score[i]++;
          G.players[i].rubies++;
          G.players = messageAll(G.players, "Player "+i+" has 2 purple chips, +1 point +1 ruby");
        } else if (totalPurples(G.players[i].pot) === 1) {
          G.score[i]++;
          G.players = messageAll(G.players, "Player "+i+" has 1 purple chip, +1 point");
        }
      }
      return G;
    },
    2: {},
    3: {},
    4: {},
  },
}

export const RedActionNumber = {
    1: (G, ctx) => {
      let p = parseInt(ctx.playerID);
      return (totalOranges(G.players[p].pot) < 1) ? 0
            : (totalOranges(G.players[p].pot) > 2) ? 2
            : 1;
    },
    2: () => 0,
    3: (G, ctx) => {
      let p = parseInt(ctx.playerID);
      let lastChip = G.players[p].pot[lastFilled(G.players[p].pot)].chip;
      return (lastChip.type==='white') ? lastChip.number : 0;
    },
    4: () => 0,
}
