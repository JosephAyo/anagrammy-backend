import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity("word")
export class Word extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "text" })
  word: string;

  @Column({ type: "int4" })
  word_length: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @Column({ type: "boolean", default: false })
  is_deleted: boolean;

  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deleted_at: Date;
}
