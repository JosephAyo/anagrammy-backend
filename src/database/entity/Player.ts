import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity("player")
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  username?: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @Column({ type: "boolean", default: false })
  is_deleted: boolean;

  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deleted_at: Date;
}
