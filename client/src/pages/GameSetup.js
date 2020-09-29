import React, { useEffect } from "react";
import { useGameStatus } from "../contexts/GameContext";
import { useHostId } from "../contexts/DataContext";
import NewGame from "../components/new game/NewGame";
import WaitingRoom from "../components/new game/WaitingRoom";
import GameOver from "../components/GameOver/GameOver"
import Game from "./Game";
import { Button } from "@material-ui/core";
import socket from "../socket";

const GameSetup = (props) => {
  const [gameStatus, setGameStatus] = useGameStatus();
  const [hostId] = useHostId();

  useEffect(() => {
    //Shows players now assigned on teams and roles, ALSO - change gameStatus now === "running"
    socket.on("update-roles", (game) => {
      console.log("socket-on-update-roles", game);
      setGameStatus(game.gameStatus);
    });
  }, [setGameStatus]);

  const gameJourney = () => {
    if (localStorage.getItem("id") === hostId) {
      return <NewGame value={props} />;
    } else {
      return <WaitingRoom value={props} />;
    }
  };


    const handleEndGame = () => {
      //Need a socket event here instead of setGameStatus
      setGameStatus("over")
    };
    

  return (
    <> 
    {gameStatus === "over" && <GameOver />}
      <div>
        {gameStatus === "running" ? <Game {...props} /> : gameJourney()}
      </div>
     {localStorage.getItem("id") === hostId && <Button onClick={handleEndGame}>End Game</Button>} 
    </>
  );
};

export default GameSetup;
