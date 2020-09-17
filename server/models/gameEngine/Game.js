const Team = require("./Team");
const Player = require("./Player");
const { getData } = require("./gameData");
const getRandomNumber = require("./util");

class Game {
  constructor() {
    this.id = getRandomNumber(1000);
    this.redTeam = new Team("red");
    this.blueTeam = new Team("blue");
    this.board = getData();
    this.turn = "blue";
    this.cardsFlipped = 0;
    this.players = [];
    console.log("Match ID:", this.id);
  }

  // Get Board
  getBoard() {
    return this.board;
  }

  // Team assignment to players
  assignTeam({ id, name }, team) {
    switch (team) {
      case this.redTeam.name:
        this.redTeam.addPlayer(new Player(id, name, team));
        break;
      case this.blueTeam.name:
        this.blueTeam.addPlayer(new Player(id, name, team));
        break;
      default:
        return null;
    }
  }

  // Assign role to a player using player Id
  assignRole(playerId, role) {
    this.redTeam.players.forEach((item) => {
      if (item.id === playerId) {
        item.setRole(role);
      }
    });

    this.blueTeam.players.forEach((item) => {
      if (item.id === playerId) {
        item.setRole(role);
      }
    });
  }

  // Any Team member picks a card
  pickCard(playerId, cardIndex) {
    let team;
    this.redTeam.players.forEach((item) => {
      if (item.id === playerId) {
        team = item.getTeam();
      }
    });

    this.blueTeam.players.forEach((item) => {
      if (item.id === playerId) {
        team = item.getTeam();
      }
    });

    let cardType = this.board[cardIndex].type;
    console.log(`${team} team picks a card and gets : ${cardType} card`);
    switch (cardType) {
      case "assasin":
        this.matchOver(team);
        break;

      case "innocent":
        this.changeTurn();
        break;
      case "red":
        if (team === this.redTeam.name) {
          this.redTeam.addPoint();
        } else {
          this.changeTurn();
        }
        break;
      case "blue":
        if (team === this.blueTeam.name) {
          this.blueTeam.addPoint();
        } else {
          this.changeTurn();
        }
        break;
      default:
        return false;
    }

    this.cardsFlipped += 1;
    this.matchDecision();
  }

  //change Turn
  changeTurn() {
    if ((this.turn = "blue")) {
      this.turn = "red";
      console.log(`${this.turn} team's turn!`);
    } else {
      this.turn = "blue";
      console.log(`${this.turn} team's turn!`);
    }
  }

  //Reset the game to initial state
  resetGame() {
    this.redTeam = new Team("red");
    this.blueTeam = new Team("blue");
    this.board = gameData;
    this.turn = "blue";
    console.log("Game was reset!!!");
  }

  // Any case where match comes to an end
  matchOver(looserTeam) {
    if (looserTeam === this.redTeam.name) {
      console.log("Congrats! Blue team won the match");
    } else {
      console.log("Congrats! Red team won the match");
    }
  }

  // Decision whether blue or red wins
  matchDecision() {
    if (this.redTeam.points + this.blueTeam.points === 16) {
      if (this.redTeam.points > this.blueTeam.points) {
        console.log(`${this.redTeam.name} wins the match`);
      } else if (this.redTeam.points === this.blueTeam.points) {
        console.log("Match was a DRAW");
      } else {
        console.log(`${this.blueTeam.name} wins the match`);
      }
    }
    else{
      console.log("Next Move Please!");
    }
  }

  joinMatch(user){
    this.players.push(user);
  }
}

module.exports = Game;