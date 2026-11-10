import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BorrowBook } from '../../borrow-books/entities/borrow-book.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  role: string;

  @Column({ default: true, nullable: false })
  isActive: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToMany(() => BorrowBook, (borrwowBook) => borrwowBook.user)
  borrowBook: any;

  @Column({ nullable: true })
  avatar: string;
}
