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
  OneToMany,
} from "typeorm";
import { Player } from "./Player";
import { Question } from "./Question";

@Entity("game")
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Player, (player) => player.id, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  @JoinColumn({ name: "player_id" })
  player: Player;

  @Column({ type: "uuid" })
  player_id: string;

  @Column({ type: "int" })
  total_levels: number;

  @Column({ type: "int" })
  current_level: number;

  @Column({ type: "int" })
  fail_count: number;

  @Column({ type: "int" })
  correct_count: number;

  @CreateDateColumn({ type: "timestamptz", nullable: true })
  started_at?: Date;

  @CreateDateColumn({ type: "timestamptz", nullable: true })
  finished_at?: Date;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @Column({ type: "boolean", default: false })
  is_deleted: boolean;

  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deleted_at: Date;

  @OneToMany(() => Question, (questions) => questions.game)
  questions: Question[];
}
