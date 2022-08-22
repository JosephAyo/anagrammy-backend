import { Game } from "@database/entity/Game";
import { Question } from "@database/entity/Question";

let io: any;
export const socketConnection = (mainIO: any) => {
  io = mainIO;
};

export const sendQuestion = (socketClientId: string, game: Game | null, question: Question | null) => {
  io.to(socketClientId).emit("new_question", { data: { game, question } });
};
