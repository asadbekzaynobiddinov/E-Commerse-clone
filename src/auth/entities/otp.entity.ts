import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('otp')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_email: string;

  @Column()
  otp_code: number;

  @Column()
  expire_time: Date;
}
