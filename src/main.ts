import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // Cấu hình thư mục tĩnh
  // Tự định nghĩa __dirname cho môi trường ESM
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Sau đó sử dụng bình thường để trỏ tới thư mục tĩnh
  const uploadPath = join(__dirname, '..', 'uploads');
  app.useStaticAssets(uploadPath, {
    prefix: '/uploads/', // Tiền tố URL để truy cập ảnh (ví dụ: localhost:3000/public/ten-anh.jpg)
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
