import { AppDataSource } from "@database/data-source";
import { Player } from "@database/entity/Player";

const playerRepository = AppDataSource.getRepository(Player);

export const getPlayerById = async (id: string): Promise<Player | null> => {
  return await playerRepository.createQueryBuilder().where(`"id" = :id`, { id }).getOne();
};

export const getPlayerBySocketClientId = async (socketClientId: string): Promise<Player | null> => {
  return await playerRepository
    .createQueryBuilder()
    .where(`"socket_client_id" = :socket_client_id`, { socket_client_id: socketClientId })
    .getOne();
};

export const checkAndUpdateExistingPlayer = async (id: string, socketClientId: string): Promise<Player | null> => {
  let existingPlayer = await getPlayerById(id);
  if (!existingPlayer) return null;

  await playerRepository.update(
    { id },
    {
      socket_client_id: socketClientId,
    },
  );
  return await getPlayerById(id);
};

export const createPlayer = async (socketClientId: string): Promise<Player> => {
  const player = new Player();
  player.socket_client_id = socketClientId;
  return await AppDataSource.manager.save(player);
};
