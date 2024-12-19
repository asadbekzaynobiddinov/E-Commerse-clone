import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column()
  title: string;

  @Column()
  address_line_1: string;

  @Column()
  address_line_2: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  postal_code: string;

  @Column()
  phone_number: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
