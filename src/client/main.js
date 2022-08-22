const socket = io();

const existingPlayerId = localStorage.getItem("player_id");
if (!existingPlayerId) {
  socket.emit("request_new_player");
  socket.on("current_player", (data) => {
    localStorage.setItem("player_id", data.player_id);
  });
}

socket.emit("start_game", localStorage.getItem("player_id"));

socket.on("new_question", (data) => {
  console.log("data :>> ", data);
});
