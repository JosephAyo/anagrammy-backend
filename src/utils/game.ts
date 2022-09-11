import { AppDataSource } from "@database/data-source";
import { Game } from "@database/entity/Game";
import { Question } from "@database/entity/Question";
import { updateQuestionAfterAnswer } from "./question";
import { IAnswerResponseDTO } from "./word";

const gameRepository = AppDataSource.getRepository(Game);

export const getGameById = async (gameId: string): Promise<Game | null> => {
  return await gameRepository
    .createQueryBuilder("game")
    .leftJoinAndSelect("game.questions", "questions")
    .where(`"game"."id" = :id`, { id: gameId })
    .getOne();
};

export const getGameByIdAndPlayerId = async (gameId: string, playerId: string): Promise<Game | null> => {
  return await gameRepository
    .createQueryBuilder()
    .where(`"id" = :game_id`, { game_id: gameId })
    .andWhere(`"player_id" = :player_id`, { player_id: playerId })
    .getOne();
};

export const updateGameToNextLevel = async (gameId: string): Promise<Game | null> => {
  let existingGame = await getGameById(gameId);
  if (!existingGame) return null;

  await gameRepository
    .createQueryBuilder("game")
    .update(Game)
    .where(`"game"."id" = :id`, { id: gameId })
    .set({ current_level: () => "current_level + 1" })
    .execute();
  return await getGameById(gameId);
};

export const updateGameAfterAnswer = async (game: Game, existingQuestion: Question, answer: IAnswerResponseDTO): Promise<Game | null> => {
  const { id: gameId } = game;
  const { data } = answer;
  if (data && game.fail_count + game.correct_count < game.total_levels) {
    await updateQuestionAfterAnswer(existingQuestion, answer);
    await gameRepository
      .createQueryBuilder("game")
      .update(Game)
      .where(`"game"."id" = :id`, { id: gameId })
      .set({
        fail_count: () => `fail_count + ${data.verdict === "incorrect" ? 1 : 0}`,
        correct_count: () => `correct_count + ${data.verdict === "correct" ? 1 : 0}`,
      })
      .execute();
  }

  return await getGameById(gameId);
};

export const checkAndUpdateExistingGame = async (gameId: string, update: object): Promise<Game | null> => {
  let existingGame = await getGameById(gameId);
  if (!existingGame) return null;

  await gameRepository.update({ id: gameId }, update);
  return await getGameById(gameId);
};

export const completeGame = async (
  gameId: string,
): Promise<{
  total_score: number;
  game: Game | null;
} | null> => {
  let existingGame = await getGameById(gameId);
  if (!existingGame) return null;

  await gameRepository
    .createQueryBuilder("game")
    .update(Game)
    .where(`"game"."id" = :id`, { id: gameId })
    .set({
      finished_at: new Date(),
    })
    .execute();
  const totalScore = existingGame.questions.reduce((acc, curr) => {
    const { is_correct, points } = curr;
    if (is_correct) acc += points;
    return acc;
  }, 0);
  existingGame = await getGameById(gameId);
  return {
    total_score: totalScore,
    game: existingGame,
  };
};

export const createGame = async (playerId: string): Promise<Game> => {
  const game = new Game();
  game.player_id = playerId;
  game.total_levels = 5;
  game.current_level = 1;
  game.fail_count = 0;
  game.correct_count = 0;
  game.started_at = new Date();
  return await AppDataSource.manager.save(game);
};
