import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from "typeorm";


@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "varchar", length: 255 })
  username: string;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  phone?: string;

  @Column({ type: "text", select: false })
  password: string;

  @Column({ type: "boolean", default: false })
  is_email_verified: boolean;

  @Column({ type: "boolean", default: false })
  is_phone_verified: boolean;

  @Column({ type: "boolean", default: false })
  is_verified: boolean;

  @Column({ type: "text", nullable: true })
  profile_pic_url?: string;

  @Column({ type: "text", nullable: true })
  address?: string;

  @Column({ type: "text", nullable: true })
  country?: string;


  @Column({ type: "timestamptz", nullable: true })
  last_login?: Date;
}
