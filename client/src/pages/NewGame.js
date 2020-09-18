import React, { useEffect } from "react";
import StepOne from "../components/new game/step 1/StepOne.js";
import StepTwo from "../components/new game/step 2/StepTwo.js";
import StepThree from "../components/new game/step 3/StepThree.js";
import Loading from "../components/new game/Loading.js";
import { useNewGame } from "../DataContext";
import {
  Button,
  Container,
  Divider,
  Grid,
  Typography,
  Card,
} from "@material-ui/core";
import axios from "axios";
import openSocket from "socket.io-client";

import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      padding: "2rem",
    },
  })
);

const NewGame = (props) => {
  const classes = useStyles();

  const newGameContext = useNewGame();
  const [newGame, setNewGame] = newGameContext;

  const localData = localStorage.getItem("newGame");

  //Users joining the match
  useEffect(() => {
    console.log("User joins the match");
    const socket = openSocket("http://localhost:3001");
    socket.on("connect", () => {
      socket.on("join-match", (data) => {
        alert("New user joined Match");
      });
    });
  }, []);

  // Calls API if no locally stored data, with otherwise use local data.
  const getNewMatch = async () => {
    const res = await axios.get("http://localhost:3001/create-match");
    if (!res.data) {
      setNewGame(JSON.parse(localStorage.getItem("newGame")));
    }
    console.log(res.data.match);

    if (res.data.match) {
      setNewGame((prevState) => ({
        ...prevState,
        matchId: res.data.match.id,
      }));
    }
  };

  useEffect(() => {
    console.log("axios call");
    getNewMatch();
  }, []);

  // Stores New Game Info to Local Storage
  useEffect(() => {
    console.log("running");
    localStorage.setItem("newGame", JSON.stringify(newGame));
  }, [newGame]);

  const nextStep = () => {
    const { step } = newGame;
    setNewGame((prevState) => ({
      ...prevState,
      step: step + 1,
    }));
  };

  const startGame = (url, data) => {
    const { step } = newGame;
    setNewGame((prevState) => ({
      ...prevState,
      step: step + 1,
    }));
  };

  const newGameSteps = () => {
    const { step } = newGame;
    switch (step) {
      // case 0:
      //   return <NewGameLoading />;
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      default:
        return <h2>Game Starts?</h2>;
    }
  };

  console.log(newGame);

  return (
    <Container maxWidth="md">
      <Card className={classes.card}>
        <Typography align="center" variant="h1">
          New Game
        </Typography>

        <Divider />

        {newGameSteps()}

        <Grid container direction="row" justify="center" alignItems="center">
          {newGame.step < 3 ? (
            <Button variant="contained" color="primary" onClick={nextStep}>
              Next
            </Button>
          ) : (
            //Needs Logic here to initiate final role allocation.
            <Button variant="contained" color="primary" onClick={startGame}>
              Create Game
            </Button>
          )}
        </Grid>
      </Card>
    </Container>
  );
};

export default NewGame;
