import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity.js';
import { BorrowBook } from '../../borrow-books/entities/borrow-book.entity.js';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  author: string;

  @Column({ nullable: false })
  price: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.book, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: any;

  @ManyToOne(() => BorrowBook, (borrowBook) => borrowBook.book)
  borrowBook: any;
}
