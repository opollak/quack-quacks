//src/Constants.js

function Spot(id,coins,points,ruby) {
  return {
    id:id,
    coins:coins,
    points:points,
    ruby:ruby,
    chip:null
  };
}

export function NewPlayer(id) {
  let pot = [Spot(0,0,0,false),
              Spot(1,1,0,false),
              Spot(2,2,0,false),
              Spot(3,3,0,false),
              Spot(4,4,0,false),
              Spot(5,5,0,true),
              Spot(6,6,1,false),
              Spot(7,7,1,false),
              Spot(8,8,1,false),
              Spot(9,9,1,true),
              Spot(10,10,2,false),
              Spot(11,11,2,false),
              Spot(12,12,2,false),
              Spot(13,13,2,true),
              Spot(14,14,3,false),
              Spot(15,15,3,false),
              Spot(16,15,3,true),
              Spot(17,16,3,false),
              Spot(18,16,4,false),
              Spot(19,17,4,false),
              Spot(20,17,4,true),
              Spot(21,18,4,false),
              Spot(22,18,5,false),
              Spot(23,19,5,false),
              Spot(24,19,5,true),
              Spot(25,20,5,false),
              Spot(26,20,6,false),
              Spot(27,21,6,false),
              Spot(28,21,6,true),
              Spot(29,22,7,false),
              Spot(30,22,7,true),
              Spot(31,23,7,false),
              Spot(32,23,8,false),
              Spot(33,24,8,false),
              Spot(34,24,8,true),
              Spot(35,25,9,false),
              Spot(36,25,9,true),
              Spot(37,26,9,false),
              Spot(38,26,10,false),
              Spot(39,27,10,false),
              Spot(40,27,10,true),
              Spot(41,28,11,false),
              Spot(42,28,11,true),
              Spot(43,29,11,false),
              Spot(44,29,12,false),
              Spot(45,30,12,false),
              Spot(46,30,12,true),
              Spot(47,31,12,false),
              Spot(48,31,13,false),
              Spot(49,32,13,false),
              Spot(50,32,13,true),
              Spot(51,33,14,false),
              Spot(52,33,14,true),
              Spot(53,35,15,false),
              ];
  pot[0].chip = {type:id.toString(),number:'drop'}
  return {
  id:id,
  bag:[{type:'white', number:1},
        {type:'white', number:1},
        {type:'white', number:1},
        {type:'white', number:1},
        {type:'white', number:2},
        {type:'white', number:2},
        {type:'white', number:3},
        {type:'orange', number:1},
        {type:'green', number:1}],
  pot:pot,
  whiteTotal:0,
  rubies:1,
  exploded:false,
  flaskFull:true,
  playerCoins:0,
  bought:'',
  rats:0,
  pointsOrCoins:'',
  message:[''],
  unreadMessages:0,
  readLast:false,
  bonus:false,
  selector:[],
  savedReds:[],
  bonusDieDrop:0,
  lessIsMoreWinner:false,
  wellStirredUsed:false,
  secondChance:false,
  }
}

export const FortuneCards = [
  {title: 'No Card', text: 'No card drawn yet', color: '#999'},
  {title: 'Roll The Die', text: 'Everyone rolls the die once and gets the bonus shown.', color: '#e8e'}, //#1
  {title: 'The Pot is Filling Up', text: 'Move your droplet one space forward.', color: '#e8e'},
  {title: 'Charity', text: 'The player(s) with the fewest rubies receive(s) 1 ruby.', color: '#e8e'},
  {title: 'Rat Infestation', text: 'Double the number of rat tails in this round.', color: '#e8e'},
  {title: "Beginner's Bonus", text: "The player(s) with the fewest victory points receive(s) 1 green 1-chip.", color: '#e8e'}, //#5
  {title: 'Just in Time', text: 'Choose: Take 4 victory points OR remove 1 white 1-chip from your bag.', color: '#e8e'},
  {title: 'You Only get to Choose One', text: 'Choose: Take 1 black chip OR any one 2-chip OR 3 rubies.', color: '#e8e'},
  {title: 'Rats are your Friends', text: 'Choose: Take any one 4-chip OR 1 victory point for each rat tail you get this turn.', color: '#e8e'},
  {title: 'A Good Start', text: 'Choose: Use your rat stone normally OR pass up on 1-3 rat tails and take that many rubies (1-3) instead.', color: '#e8e'},
  {title: 'Choose Wisely', text: 'Choose: Move your droplet 2 spaces forward OR take 1 purple chip.', color: '#e8e'}, //#10
  {title: 'Wheel and Deal', text: 'You can trade 1 ruby for any one 1-chip (not purple or black).', color: '#e8e'},
  {title: 'An Opportunistic Moment', text: "Draw 4 chips from your bag. You may trade in 1 of them for a chip of the same color with the next higher value. If you can't make a trade, take 1 green 1-chip. Put all the chips back into the bag.", color: '#e8e'},
  {title: 'Less is More', text: 'All players draw 5 chips. The player(s) with the lowest sum take(s) 1 blue 2-chip. All other players receive 1 ruby. Put all the chips back into the bag.', color: '#e8e'},
  {title: 'The Pot is Full', text: 'Any player who gets to roll the die this round rolls twice.', color: '#9cf'},
  {title: 'Pumpkin Patch Party', text: 'In this round, every orange chip is moved 1 extra space forward.', color: '#9cf'}, //#15
  {title: 'Lucky Devil', text: 'If you reach a scoring space with a ruby this round, you get an extra 2 victory points, even if your pot has exploded.', color: '#9cf'},
  {title: "It's Shining Extra Bright", text: "If you reach a scoring space with a ruby this round, you get an extra ruby.", color: '#9cf'},
  {title: 'Magic Potion', text: 'At the end of the round, all flasks get a free refill.', color: '#9cf'},
  {title: 'Seasoned Perfectly', text: 'If your white chips total exactly 7 at the end of the round, you get to move your droplet 1 space forward.', color: '#9cf'},
  {title: 'Living in Luxury', text: 'The threshold for white chips is raised in this round from 7 to 9.', color: '#9cf'}, //#20
  {title: 'Well Stirred', text: 'In this round, you may put the first white chip you draw back into the bag.', color: '#9cf'},
  {title: 'Strong Ingredient', text: 'Beginning with the start player, if you stopped without an explosion, draw up to 5 chips from your bag. You may place 1 of them in your pot.', color: '#9cf'},
  {title: 'Schadenfreude', text: 'If your pot explodes this round, the player to your left (before you) gets any one 2-chip.', color: '#9cf'},
  {title: 'A Second Chance', text: 'After you have placed the first 5 chips in your pot, choose to continue OR begin the round all over again - but you get this choice only once', color: '#9cf'},
];

export const SetCost = {
  1: {
    orange: {1: 3},
    green: {1: 4, 2: 8, 4: 14},
    black: {1: 10},
    purple: {1: 9},
    blue: {1: 5, 2: 10, 4: 19},
    red: {1: 6, 2: 10, 4: 16},
    yellow: {1: 8, 2: 12, 4: 18},
  },
  2: {
    orange: {1: 3},
    green: {1: 6, 2: 11, 4: 18},
    black: {1: 10},
    purple: {1: 12},
    blue: {1: 5, 2: 10, 4: 19},
    red: {1: 4, 2: 8, 4: 14},
    yellow: {1: 9, 2: 13, 4: 19},
  },
  3: {
    orange: {1: 3},
    green: {1: 6, 2: 11, 4: 21},
    black: {1: 10},
    purple: {1: 10},
    blue: {1: 4, 2: 8, 4: 14},
    red: {1: 5, 2: 9, 4: 15},
    yellow: {1: 8, 2: 12, 4: 18},
  },
  4: {
    orange: {1: 3},
    green: {1: 4, 2: 8, 4: 14},
    black: {1: 10},
    purple: {1: 11},
    blue: {1: 5, 2: 10, 4: 19},
    red: {1: 7, 2: 11, 4: 17},
    yellow: {1: 8, 2: 12, 4: 18},
  }
};

export const NewStore = {
  orange: {1: 20},
  green: {1: 15, 2: 10, 4: 13},
  blue: {1: 14, 2: 10, 4: 10},
  red: {1: 12, 2: 8, 4: 10},
  black: {1: 18},
  yellow: {1: 0, 2: 0, 4: 0},
  purple: {1: 0},
};

export const ColorRef = {
  0: 'orange',
  1: 'black',
  2: 'purple',
  3: 'green',
  4: 'blue',
  5: 'red',
  6: 'yellow',
  7: 'white',
}

export const ChipText = {
  orange: {1: "No bonus", 2: "No bonus", 3: "No bonus", 4: "No Bonus"},
  black: {1: "2-player game: If you draw as many black chips as the other player, move you droplet 1 space forward. If you draw more black chips than the other player, move your droplet 1 space forward and receive 1 ruby. 3+ player game: If you draw more black chips than one of the players sitting next to you (immediately before or after), move your droplet 1 space forward. If you draw more black chips than both players sitting next to you, move your droplet 1 space forward and receive 1 ruby.",},
  purple: {1: "Count up the purple chips in your pot. If there is 1 purple chip, you receive 1 victory point. If there are 2 purple chips, you receive 1 victory point and 1 ruby. If there are 3 or more purple chips, you receive 2 victory points and you may move your droplet 1 space forward.",},
  green: {1: "For each green chip that is the last or next-to-last chip in your pot, you receive 1 ruby.",},
  blue: {1: "Draw 1/2/4 chips from your bag. You may place 1 of them in your pot.",},
  red: {1: "If there are already orange chips in your pot, move the red forward according to the chart: 1 or 2 orange chips, move the red chip forward an additional 1 space; 3 or more orange chips, move the red chip forward an additional 2 spaces.",},
  yellow: {1: "If the previously played chip was white, put the white chip back into the bag.",},
}

export const RatTails = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1,
                         0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                         1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                         0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
                         1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,];
