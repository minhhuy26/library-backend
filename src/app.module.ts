import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module.js';
import { BooksModule } from './books/books.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { BorrowBooksModule } from './borrow-books/borrow-books.module.js';
import { Book } from './books/entities/book.entity.js';
import { User } from './users/entities/user.entity.js';
import { Category } from './categories/entities/category.entity.js';
import { BorrowBook } from './borrow-books/entities/borrow-book.entity.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Book, Category, BorrowBook], // Chỉ định các entity ở đây
        synchronize: true, // Tự động tạo bảng từ Entity ở env local
        logging: true, // log query sql ,chỉ dùng ở local/dev
      }),
    }),

    UsersModule,

    BooksModule,

    CategoriesModule,

    BorrowBooksModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
