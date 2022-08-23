import { AppDataSource } from "@database/data-source";
import { Question } from "@database/entity/Question";
import { getRandomWord, IAnswerResponseDTO } from "./word";

const questionRepository = AppDataSource.getRepository(Question);

export const getQuestionById = async (questionId: string): Promise<Question | null> => {
  return await questionRepository.createQueryBuilder().where(`"id" = :id`, { id: questionId }).getOne();
};

export const getQuestionByIdAndGameId = async (questionId: string, gameId: string): Promise<Question | null> => {
  return await questionRepository
    .createQueryBuilder()
    .where(`"id" = :question_id`, { question_id: questionId })
    .andWhere(`"game_id" = :game_id`, { game_id: gameId })
    .getOne();
};

export const updateQuestionAfterAnswer = async (question: Question, answer: IAnswerResponseDTO): Promise<Question | null> => {
  const { id: questionId } = question;

  const { data, anagram, has_anagram } = answer;
  if (data) {
    await questionRepository
      .createQueryBuilder("question")
      .update(Question)
      .where(`"question"."id" = :id`, { id: questionId })
      .set({ answer: anagram, is_answer_no_anagram: !has_anagram, is_correct: data.verdict === "correct", answered_at: new Date() })
      .execute();
  }

  return await getQuestionById(questionId);
};

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
