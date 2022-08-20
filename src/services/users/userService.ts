import { AppDataSource } from "@database/data-source";
import { User } from "@database/entity/User";
import { Word } from "@database/entity/Word";
import { compareHashedString, generateUserJWT, hashString, passwordRegexPattern } from "@utils/auth";
import { IResponseWrapper } from "@utils/responses";
import { getUserByEmail, getUserByPhone, signInUser, updatePassword } from "@utils/users";
import { Request } from "express";
import Joi, { number, string } from "joi";

export default class UserService {
  readonly userRepository;
  readonly wordRepository;
  constructor(private req: Request, private res: IResponseWrapper) {
    this.userRepository = AppDataSource.getRepository(User);
    this.wordRepository = AppDataSource.getRepository(Word);
  }

  async signUp() {
    try {
      const { body } = this.req;
      const schema = Joi.object({
        first_name: Joi.string().min(2).max(30).required(),
        password: Joi.string().pattern(passwordRegexPattern).required(),
        repeat_password: Joi.ref("password"),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        phone: Joi.string()
          .min(10)
          .max(14)
          .pattern(/^[0-9]+$/)
          .required(),
        address: Joi.string(),
        country: Joi.string(),
      }).options({ allowUnknown: true });
      const data = await schema.validateAsync(body);
      const { first_name, password, email, phone, address, country } = data;
      const [existingUserByEmail, existingUserByPhone] = await Promise.all([getUserByEmail(email), getUserByPhone(phone)]);
      if (existingUserByEmail || existingUserByPhone)
        return this.res.ErrorResponse({ title: "Error", code: 500, message: "user already exists" });
      const hashedPassword = await hashString(password);
      const user = new User();
      user.username = first_name;

      user.email = email;
      user.phone = phone;
      user.address = address;
      user.country = country;
      user.password = hashedPassword;
      user.last_login = new Date();
      const savedUser = await AppDataSource.manager.save(user);
      if (!savedUser) return this.res.ErrorResponse({ title: "Error", code: 500, message: "user was not saved, try again" });
      const signedUpUser = await getUserByEmail(email);
      const token = generateUserJWT(savedUser);
      await signInUser(savedUser.id);
      return this.res.SuccessResponse({
        title: "Success",
        code: 201,
        data: {
          user: signedUpUser,
          token,
        },
      });
    } catch (error) {
      console.log("error :>>", error);
      return this.res.ErrorResponse({ title: "Error", code: 500, message: error });
    }
  }

  async signIn() {
    try {
      const { body } = this.req;
      const schema = Joi.object({
        password: Joi.string().pattern(passwordRegexPattern).required(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
      }).options({ allowUnknown: true });
      const data = await schema.validateAsync(body);
      const { password, email } = data;
      const existingUser = await this.userRepository
        .createQueryBuilder("user")
        .where("user.email = :email", { email })
        .addSelect("user.password")
        .getOne();

      if (!existingUser) return this.res.ErrorResponse({ title: "Error", code: 401, message: "incorrect credentials" });

      const isMatch = await compareHashedString(password, existingUser.password);
      if (!isMatch) return this.res.ErrorResponse({ title: "Error", code: 401, message: "incorrect credentials" });
      const token = generateUserJWT(existingUser);
      await signInUser(existingUser.id);
      const signedInUser = await getUserByEmail(email);
      return this.res.SuccessResponse({
        title: "Success",
        code: 200,
        message: "Signed in",
        data: {
          user: signedInUser,
          token,
        },
      });
    } catch (error) {
      console.log("error :>>", error);
      return this.res.ErrorResponse({ title: "Error", code: 500, message: error });
    }
  }

  async viewProfile() {
    try {
      const { user } = this.req;
      return this.res.SuccessResponse({
        title: "Success",
        code: 200,
        data: {
          user,
        },
      });
    } catch (error) {
      console.log("error :>>", error);
      return this.res.ErrorResponse({ title: "Error", code: 500, message: error });
    }
  }

  async changePassword() {
    try {
      const { user, body } = this.req;
      const schema = Joi.object({
        old_password: Joi.string().pattern(passwordRegexPattern).required(),
        new_password: Joi.string().pattern(passwordRegexPattern).required(),
        repeat_password: Joi.ref("new_password"),
      }).options({ allowUnknown: true });
      const data = await schema.validateAsync(body);
      const { old_password, new_password } = data;
      const existingUser = await this.userRepository
        .createQueryBuilder("user")
        .where("user.email = :email", { email: user.email })
        .addSelect("user.password")
        .getOne();
      const isMatch = await compareHashedString(old_password, existingUser!.password);
      if (!isMatch) return this.res.ErrorResponse({ title: "Error", code: 401, message: "incorrect credentials" });

      await updatePassword(user, new_password);
      return this.res.SuccessResponse({
        title: "Success",
        code: 200,
      });
    } catch (error) {
      console.log("error :>>", error);
      return this.res.ErrorResponse({ title: "Error", code: 500, message: error });
    }
  }

  async editProfile() {
    try {
      const { body, user } = this.req;
      const schema = Joi.object({
        first_name: Joi.string().min(2).max(30),
        last_name: Joi.string().min(2).max(30),
        address: Joi.string().min(2),
        country: Joi.string().min(2),
      }).options({ allowUnknown: true });

      const data = await schema.validateAsync(body);

      const updates = Object.keys(data).reduce((acc, curr) => {
        const editableColumns = ["username"];
        return data[curr] !== null && editableColumns.includes(curr) ? { ...acc, [curr]: data[curr] } : acc;
      }, {});
      await this.userRepository.update({ id: user.id }, updates);
      return this.res.SuccessResponse({
        title: "Success",
        code: 200,
      });
    } catch (error) {
      console.log("error :>>", error);
      return this.res.ErrorResponse({ title: "Error", code: 500, message: error });
    }
  }

  async checkAnagram() {
    try {
      const { body } = this.req;
      const schema = Joi.object({
        word: Joi.string().min(5).max(10).required(),
        anagram: Joi.string().min(5).max(10).when("has_anagram", {
          is: true,
          then: Joi.required(),
        }),
        has_anagram: Joi.boolean().required(),
      }).options({ allowUnknown: true });
      const data = await schema.validateAsync(body);
      const { word, anagram, has_anagram } = data;
      const existingWord = await this.wordRepository.createQueryBuilder().where(`"word" = :word`, { word }).getOne();
      if (!existingWord) return this.res.ErrorResponse({ title: "Error", code: 401, message: "incorrect word" });
      const wordMap = existingWord.word.split("").reduce((acc: { [key: string]: number }, curr) => {
        if (acc[curr]) {
          acc[curr] += 1;
        } else {
          acc[curr] = 1;
        }

        return acc;
      }, {});
      const mainWordKeys = Object.keys(wordMap);

      const sameLengthWords = await this.wordRepository
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

      return this.res.SuccessResponse({
        title: "Success",
        code: 200,
        data: {
          verdict,
          anagramWords,
        },
      });
    } catch (error) {
      console.log("error :>>", error);
      return this.res.ErrorResponse({ title: "Error", code: 500, message: error });
    }
  }
}
