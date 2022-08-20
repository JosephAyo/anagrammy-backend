import { MigrationInterface, QueryRunner } from "typeorm";
import fs from "fs";
import readline from "readline";
import path from "path";

export class insertWords1661016073112 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const fileStream = fs.createReadStream(path.join(__dirname + "../../../config/words_alpha.txt"));

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      if (line.length > 4 && line.length <= 10) {
        await queryRunner.query(`
        INSERT INTO word(word,word_length)
        VALUES ('${line}','${line.length}');
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DELETE FROM word;
    `);
  }
}
