import { AppDataSource } from "@database/data-source";
import { Game } from "@database/entity/Game";

const gameRepository = AppDataSource.getRepository(Game);

export const getGameById = async (id: string): Promise<Game | null> => {
  return await gameRepository.createQueryBuilder().where(`"id" = :id`, { id }).getOne();
};

export const getGameByPlayerId = async (playerId: string): Promise<Game | null> => {
  return await gameRepository.createQueryBuilder().where(`"player_id" = :player_id`, { player_id: playerId }).getOne();
};

export const updateGameToNextLevel = async (id: string): Promise<Game | null> => {
  let existingGame = await getGameById(id);
  if (!existingGame) return null;

  await gameRepository
    .createQueryBuilder("game")
    .update(Game)
    .where(`"game"."id" = :id`, { id })
    .set({ current_level: () => "current_level + 1" })
    .execute();
  return await getGameById(id);
};
export const checkAndUpdateExistingGame = async (id: string, update: object): Promise<Game | null> => {
  let existingGame = await getGameById(id);
  if (!existingGame) return null;

  await gameRepository.update({ id }, update);
  return await getGameById(id);
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
