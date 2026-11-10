import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // lấy token ở đâu
      ignoreExpiration: false, // token hết hạn có dùng đc nữa k => không
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretkey', // lấy secret key từ .env
    });
  }
  /**
   * Hàm này tự động chạy SAU KHI token được kiểm tra hợp lệ và giải mã thành công.
   * Tham số 'payload' chính là cục dữ liệu JSON nguyên bản được cất bên trong token.
   *
   * LƯU Ý QUAN TRỌNG: Bất cứ object nào được return từ hàm này
   * sẽ được NestJS tự động ghim vào biến `request.user` của hệ thống.
   */
  async validate(payload: any) {
    return {
      id: payload.sub, // payload.sub là chuẩn của JWT lưu ID user, ta đổi tên thành userId cho dễ gọi ở Controller
      // Lấy email và role đã lưu trong token
      email: payload.email,
      role: payload.role,
    };
  }
}
/** 
User gửi Request kèm Token lên server.

Hàm validate giải mã Token, tạo ra cục { userId, email, role } và âm thầm gắn nó vào biến req.user.

Lúc này ở Controller, thay vì trả thẳng cục dữ liệu ngắn ngủn đó cho user, bạn sẽ dùng nó để truy vấn Database và lấy ra thông tin đầy đủ.
*/
