import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import apiRouter from "@routes/api";
import { IResponseError, ResponseWrapper } from "@utils/responses";
import "@config/passportHandler";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { checkAndUpdateExistingPlayer, createPlayer } from "@utils/player";
import { sendQuestion, socketConnection } from "@utils/socket";
import {
  checkAndUpdateExistingGame,
  completeGame,
  createGame,
  getGameByIdAndPlayerId,
  updateGameAfterAnswer,
  updateGameToNextLevel,
} from "@utils/game";
import { createQuestion, getQuestionByIdAndGameId } from "@utils/question";
import { checkAnswer } from "@utils/word";

const PREFIX = "/api/" + process.env.version || "v1";

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  allowEIO3: true,
});

socketConnection(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

// Security
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
    }),
  );
}

app.get("/", (_req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(PREFIX, apiRouter);

// Static files
app.use(express.static(path.join(__dirname, "client")));

app.use("/*", (_req: Request, _res: Response, next) => {
  let error: IResponseError = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error: IResponseError, _req: Request, res: Response, _next: NextFunction) => {
  const response = new ResponseWrapper(res);
  const title = error.status == 404 ? "Invalid endpoint" : "Unauthorized";
  return response.ErrorResponse({
    title,
    message: error.message,
    code: error.status,
  });
});

// Socket setup
io.on("connection", function (socket) {
  const socketClientId = socket.id;
  console.log("user connected", socketClientId);

  socket.on("request_existing_player", async (playerId) => {
    const current_player = await checkAndUpdateExistingPlayer(playerId, socketClientId);
    if (current_player) io.to(socketClientId).emit("current_player", { player_id: current_player.id });
    else {
      const newPlayer = await createPlayer(socketClientId);
      io.to(socketClientId).emit("current_player", { player_id: newPlayer.id });
    }
  });

  socket.on("request_new_player", async () => {
    const newPlayer = await createPlayer(socketClientId);
    io.to(socketClientId).emit("current_player", { player_id: newPlayer.id });
  });

  socket.on("start_game", async (playerId) => {
    const newGame = await createGame(playerId);
    const question = await createQuestion(newGame.id, 0);
    sendQuestion(socketClientId, newGame, question);
  });

  socket.on("request_question", async (gameId) => {
    const existingGame = await updateGameToNextLevel(gameId);
    if (!existingGame) io.to(socketClientId).emit("error", { hasError: true, code: 424, message: "no existing game" });
    else {
      const question = await createQuestion(existingGame.id, existingGame.current_level + 1);
      sendQuestion(socketClientId, existingGame, question);
    }
  });

  socket.on("answer_question", async (data) => {
    const { playerId, gameId, questionId } = data;
    const existingGame = await getGameByIdAndPlayerId(gameId, playerId);
    const existingQuestion = await getQuestionByIdAndGameId(questionId, gameId);
    if (!existingGame) return io.to(socketClientId).emit("error", { hasError: true, code: 424, message: "no existing game" });
    if (!existingQuestion) return io.to(socketClientId).emit("error", { hasError: true, code: 424, message: "no existing question" });
    const answer = await checkAnswer(data);
    const updatedGame = await updateGameAfterAnswer(existingGame, existingQuestion, answer);
    if (updatedGame && updatedGame.current_level === updatedGame.total_levels) {
      const completedGame = await completeGame(gameId);
      return io
        .to(socketClientId)
        .emit("game_completed", { data: { title: answer.title, code: answer.code, answer, ...completedGame } });
    }
    return io.to(socketClientId).emit("answer_response", { data: { title: answer.title, code: answer.code, answer, game: updatedGame } });
  });

  socket.on("game_summary", async (data) => {
    console.log('socket.on("game_summary"')
    const { playerId, gameId } = data;
    const existingGame = await getGameByIdAndPlayerId(gameId, playerId);
    if (!existingGame) return io.to(socketClientId).emit("error", { hasError: true, code: 424, message: "no existing game" });
    if (existingGame.current_level === existingGame.total_levels) {
      const completedGame = await completeGame(gameId);
      return io.to(socketClientId).emit("game_summary_response", { data: { title: "Success", code: 200, ...completedGame } });
    }
  });
});
export default server;
