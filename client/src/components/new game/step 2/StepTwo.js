import React, { useEffect, useState } from "react";
import { useNewGame, usePlayers } from "../../../contexts/DataContext";
import socket from "../../../socket";

const StepTwo = () => {
  const newGameContext = useNewGame();
  const [newGame, setNewGame] = newGameContext;

  const usePlayersContext = usePlayers();
  const [players, setPlayers] = usePlayersContext;

  useEffect(() => {
    // User joins the room
    let room = "match-" + newGame.matchId;
    let matchId = newGame.matchId;
    let userEmail = localStorage.getItem("email");
    let data = {
      room: room,
      matchId: matchId,
      userEmail: userEmail,
    };
    if (newGame.matchId !== "") {
      socket.emit("join-match", data);
    }

    //Shows players that have joined so far in game setup (Will be displayed in StepTwo.js)
    socket.on("update-players", (match) => {
      setPlayers(match.players);
    });
  }, [newGame]);

  const showPlayers = () => {
    return players.map((player, i) => {
      return (
        <div key={i}>
          <p>
            Player ID: {player.id} / Player Name: {player.name}
          </p>
        </div>
      );
    });
  };

  return (
    <>
      <h2>step2</h2>
      {showPlayers()}
      <p>waiting room as people join. </p>
      <p>
        when players join, they will be added to a state on the host's frontend.
      </p>
      <p>
        once all players have joined, host can click "next" to assign roles.
      </p>
    </>
  );
};

export default StepTwo;
