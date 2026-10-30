import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Catagory } from '../../catagories/entities/catagory.entity.js';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column()
  author: string;

  @Column()
  price: number;

  @ManyToOne(() => Catagory, (catagory) => catagory.books, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: any;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
  catagory: any;
  borrowBooks: any;
}
