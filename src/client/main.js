const socket = io();
let gameProgressEl = document.getElementById("game_progress");
let gameScoreEl = document.getElementById("game_score");
let errorMessageEl = document.getElementById("error_message");
let questionWordEl = document.getElementById("question_word");
let answerFormSubmitButtonEl = document.getElementById("answer_form__button");
let noAnagramFormSubmitButtonEl = document.getElementById("no_anagram_form__button");
let answerFormInputEl = document.getElementById("answer_form__input");
let gameSummaryEl = document.getElementById("game_summary");
let gameId;
let questionId;
let questionWord;

const startGame = () => {
  socket.emit("start_game", localStorage.getItem("player_id"));
};

const existingPlayerId = localStorage.getItem("player_id");
if (!existingPlayerId) {
  socket.emit("request_new_player");
} else {
  socket.emit("request_existing_player", existingPlayerId);
}

socket.on("current_player", (data) => {
  localStorage.setItem("player_id", data.player_id);
  startGame();
});

socket.on("new_question", ({ data }) => {
  const { game, question } = data;
  if (game) {
    gameId = game.id;
    gameProgressEl.innerHTML = `<b>Level:</b> ${game.current_level}/${game.total_levels}`;
    gameScoreEl.innerHTML = `<b>Correct Answers:</b> ${game.correct_count}`;
  }
  if (question) {
    questionId = question.id;
    questionWord = question.word.word;
    questionWordEl.innerHTML = question.word.word;
  }
});

answerFormSubmitButtonEl.addEventListener("click", function (e) {
  e.preventDefault();
  const inputValue = answerFormInputEl.value;
  answerQuestion({
    playerId: localStorage.getItem("player_id"),
    gameId,
    questionId,
    word: questionWord,
    anagram: inputValue.toLowerCase(),
    has_anagram: true,
  });
});

noAnagramFormSubmitButtonEl.addEventListener("click", function (e) {
  e.preventDefault();
  const inputValue = answerFormInputEl.value;
  answerQuestion({
    playerId: localStorage.getItem("player_id"),
    gameId,
    questionId,
    word: questionWord,
    has_anagram: false,
  });
});

const answerQuestion = ({ playerId, gameId, questionId, word, anagram, has_anagram }) => {
  socket.emit("answer_question", { playerId, gameId, questionId, word, anagram, has_anagram });
};

socket.on("error", ({ hasError, code, message }) => {
  errorMessageEl.innerHTML = message;
});

socket.on("answer_response", ({ data }) => {
  console.log(" answer_response data :>> ", data.answer.data.anagramWords);
  answerFormInputEl.value = "";
  socket.emit("request_question", gameId);
});

socket.on("game_completed", ({ data }) => {
  console.log(" game_completed data :>> ", data);
  socket.emit("game_summary", { playerId: localStorage.getItem("player_id"), gameId });
});

socket.on("game_summary_response", ({ data }) => {
  console.log(" game_summary_response data :>> ", data);
  gameSummaryEl.innerHTML = `<b>Total score:</b> ${data.game.total_score}`;
  gameScoreEl.innerHTML = `<b>Correct Answers:</b> ${data.game.game.correct_count}`;
  questionWordEl.hidden = true;
  answerFormSubmitButtonEl.hidden = true;
  noAnagramFormSubmitButtonEl.hidden = true;
  answerFormInputEl.hidden = true;
});
