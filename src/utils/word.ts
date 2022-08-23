import { AppDataSource } from "@database/data-source";
import { Word } from "@database/entity/Word";

const wordRepository = AppDataSource.getRepository(Word);

export const getWordById = async (id: number): Promise<Word | null> => {
  return await wordRepository.createQueryBuilder().where(`"id" = :id`, { id }).getOne();
};

export const getRandomWord = async (): Promise<Word | null> => {
  return await wordRepository.createQueryBuilder().where(`"word_length" = ${5}`).orderBy("RANDOM()").limit(1).getOne();
};

export interface IAnswerDTO {
  word: string;
  anagram: string;
  has_anagram: boolean;
}
export interface IAnswerResponseDTO extends IAnswerDTO {
  title: string;
  code: number;
  data?: {
    verdict: "correct" | "incorrect";
    anagramWords: Array<string>;
  };
}

export const checkAnswer = async (body: IAnswerDTO): Promise<IAnswerResponseDTO> => {
  const { word, anagram, has_anagram } = body;
  const existingWord = await wordRepository.createQueryBuilder().where(`"word" = :word`, { word }).getOne();
  if (!existingWord)
    return {
      word,
      anagram,
      has_anagram,
      title: "Error",
      code: 500,
    };
  const wordMap = existingWord.word.split("").reduce((acc: { [key: string]: number }, curr) => {
    if (acc[curr]) {
      acc[curr] += 1;
    } else {
      acc[curr] = 1;
    }

    return acc;
  }, {});
  const mainWordKeys = Object.keys(wordMap);

  const sameLengthWords = await wordRepository
    .createQueryBuilder()
    .where(`"word_length" = ${word.length}`)
    .andWhere(`"word" != '${word}'`)
    .getMany();

  const anagramWords = [];

  for (let i = 0; i < sameLengthWords.length; i++) {
    const currentWord = sameLengthWords[i].word;

    const currentWordMap = currentWord.split("").reduce((acc: { [key: string]: number }, curr) => {
      if (acc[curr]) {
        acc[curr] += 1;
      } else {
        acc[curr] = 1;
      }

      return acc;
    }, {});
    let isMatch = true;
    for (let j = 0; j < mainWordKeys.length; j++) {
      isMatch = isMatch && wordMap[mainWordKeys[j]] === currentWordMap[mainWordKeys[j]];
    }
    if (isMatch) anagramWords.push(currentWord);
  }

  const verdict = has_anagram
    ? anagramWords.includes(anagram)
      ? "correct"
      : "incorrect"
    : anagramWords.length < 1
    ? "correct"
    : "incorrect";

  return {
    word,
    anagram,
    has_anagram,
    title: "Success",
    code: 200,
    data: {
      verdict,
      anagramWords,
    },
  };
};
