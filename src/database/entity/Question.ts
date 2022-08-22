import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Game } from "./Game";
import { Word } from "./Word";

@Entity("question")
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Game, (game) => game.id, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  @JoinColumn({ name: "game_id" })
  game: Game;

  @Column({ type: "uuid" })
  game_id: string;

  @ManyToOne(() => Word, (word) => word.id, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  @JoinColumn({ name: "word_id" })
  word: Word;

  @Column({ type: "uuid" })
  word_id: string;

  @Column({ type: "int" })
  level: number;

  @Column({ type: "text" })
  answer?: string;

  @Column({ type: "boolean", nullable: true })
  is_answer_no_anagram?: boolean;

  @Column({ type: "boolean", nullable: true })
  is_correct?: boolean;

  @Column({ type: "int" })
  points: number;

  @CreateDateColumn({ type: "timestamptz" })
  asked_at: Date;

  @CreateDateColumn({ type: "timestamptz" , nullable: true })
  answered_at?: Date;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @Column({ type: "boolean", default: false })
  is_deleted: boolean;

  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deleted_at: Date;
}
