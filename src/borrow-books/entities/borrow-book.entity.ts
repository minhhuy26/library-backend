import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Book } from '../../books/entities/book.entity.js';

@Entity('borrow_books')
export class BorrowBook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  borrowDate: Date;

  @Column({ nullable: false })
  expectReturnDate: Date;

  @Column({ nullable: false })
  penaltyMoney: number;

  @Column({ nullable: false })
  status: string;

  @Column({ nullable: true })
  returnDate: Date;

  @OneToMany(() => User, (user) => user.borrowBook)
  user: any;

  @OneToMany(() => Book, (book) => book.borrowBook)
  book: any;
}
