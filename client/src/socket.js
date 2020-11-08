import io from "socket.io-client";
const socket = io("https://cluewords-api.herokuapp.com/");

export default socket;
