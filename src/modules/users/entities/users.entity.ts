import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";

@Entity({ name: "t_users" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column("bigint")
  phone?: number;

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase?() {
    this.email = this.email.toLowerCase();
  }
}
