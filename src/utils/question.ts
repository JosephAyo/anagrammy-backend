import { AppDataSource } from "@database/data-source";
import { Question } from "@database/entity/Question";
import { getRandomWord } from "./word";

const questionRepository = AppDataSource.getRepository(Question);

export const getQuestionById = async (id: string): Promise<Question | null> => {
  return await questionRepository.createQueryBuilder().where(`"id" = :id`, { id }).getOne();
};

// export const checkAndUpdateExistingQuestion = async (id: string, socketClientId: string): Promise<Question | null> => {
//   let existingQuestion = await getQuestionById(id);
//   if (!existingQuestion) return null;

//   await questionRepository.update(
//     { id },
//     {
//       socket_client_id: socketClientId,
//     },
//   );
//   return await getQuestionById(id);
// };

export const createQuestion = async (gameId: string, currentGameLevel: number): Promise<Question | null> => {
  const word = await getRandomWord();
  if (!word) {
    return null;
  }
  const question = new Question();
  question.game_id = gameId;
  question.word = word;
  question.level = currentGameLevel + 1;
  question.points = word.word.length;
  question.asked_at = new Date();
  return await AppDataSource.manager.save(question);
};
