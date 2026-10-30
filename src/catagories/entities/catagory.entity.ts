import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../../books/entities/book.entity.js';

@Entity('Catagories')
export class Catagory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
  @OneToMany(() => Book, (book) => book.catagory)
  books: any[];
}
