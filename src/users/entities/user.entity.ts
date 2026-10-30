import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') // Random
  id: string;
  @Column()
  fullName: string;
  @Column()
  phone: string;
  @Column({ unique: true, nullable: false })
  email: string;
  @Column({ nullable: false })
  password: string;
  @Column({ nullable: false })
  role: string;
  @Column({ nullable: false, default: true })
  isActive: boolean;
  @Column()
  createDate: Date;
  @Column()
  updateAt: Date;
  borrowBooks: any;
}
