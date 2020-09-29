import React, { useState, useEffect } from "react";
import GameBar from "../../components/GameBar";
import Messenger from "../../components/Messenger";
import Board from "../../components/Board";
import socket from "../../socket";
import useStyles from "./styles";

const Game = (props) => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [messages, setMessages] = useState([]);
  const [board, setBoard] = useState([]);
  const [isSpyMaster, setIsSpyMaster] = useState(false);
  const [currentTurn, setCurrentTurn] = useState("");
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);

  const gameId = props.match.params.id;
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    // join the match
    socket.emit("init-game", { gameId, token }, (recv) => {
      console.log("Game State:", recv);

      setName(recv.name);
      setMessages(recv.history);
      setBoard(recv.state.board);

      // search game stare to find role of this user
      const redPlayers = recv.state.redTeam.players;
      const bluePlayers = recv.state.blueTeam.players;

      const redIdx = redPlayers.findIndex((p) => p.name === recv.name);
      const blueIdx = bluePlayers.findIndex((p) => p.name === recv.name);

      if (redIdx > -1) {
        setTeam("red");

        if (redPlayers[redIdx].role === "spy-master") {
          setIsSpyMaster(true);
        }
      } else if (blueIdx > -1) {
        setTeam("blue");

        if (bluePlayers[blueIdx].role === "spy-master") {
          setIsSpyMaster(true);
        }
      }

      // set current state of the game
      setCurrentTurn(recv.state.turn);
    });

    socket.on("update-game", (recv) => {
      console.log("Updated Game State:", recv);

      // set current state of the game
      setBoard(recv.board);
      setCurrentTurn(recv.turn);
    });

    socket.on("new-message", (recv) => {
      setMessages((prevMessages) => [...prevMessages, recv]);
    });

    socket.on("redirect", () => {
      console.log("user not valid");
      // props.history.push("/login");
    });
  }, [gameId, token]);

  const sendMessage = (msg) => {
    const msgData = {
      sender: name,
      message: msg,
    };

    // send message to the server
    socket.emit("message", {
      gameId,
      token,
      msgData,
    });
  };

  const changeTurn = () => {
    socket.emit("change-turn", { gameId });
  }

  return (
    <div className={classes.Game}>
      <GameBar
        currentTurn={currentTurn}
        redScore={redScore}
        blueScore={blueScore}
      />
      <div className={classes.GameArea}>
        <Messenger
          messages={messages}
          sendMessage={sendMessage}
          name={name}
          isSpyMaster={isSpyMaster}
          isTurn={team === currentTurn}
          changeTurn={changeTurn}
        />
        <Board board={board} isSpyMaster={isSpyMaster} />
      </div>
    </div>
  );
};

export default Game;
