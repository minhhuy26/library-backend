import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { Repository } from 'typeorm';
import { Role } from '../common/enums/role.enum.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) // có sẵn trong nest,giúp thao tác trực tiếp tới database theo entity đc dùng,dùng qua các hàm như create,save,findOne,...
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    if (registerDto.password !== registerDto.retypePassword)
      throw new BadRequestException('password and retypePassword not match');

    const { email, password, phone, fullName } = registerDto;
    // B1:Check Account

    const existsUser = await this.userRepository.findOne({
      // hàm findOne tìm trong db theo điều kiện email
      where: {
        email: email.trim(),
      },
    });
    if (existsUser) {
      throw new BadRequestException('Account exists');
    }

    // B2:Create new User
    const salt = await bcrypt.genSalt(10); // tạo chuỗi mã hóa có 10 kí tự
    const passwordHashed = await bcrypt.hash(password, salt); // lấy pass của user nhập trộn với chuỗi mã hóa ở trên->mật khẩu đc mã hóa lưu vào db
    const newUser = this.userRepository.create({
      // hàm create tạo thông tin cho user
      email: email.trim(),
      password: passwordHashed,
      phone,
      fullName,
      isActive: true,
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.userRepository.save(newUser); // lưu thông tin vừa tạo xuống db
    return {
      message: 'success',
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
      },
    };
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const exists = await this.userRepository.findOne({
      where: {
        email: email.trim(),
      },
    });
    if (!exists) {
      throw new UnauthorizedException('Email or password incorrect');
    }
    if (!exists.isActive) {
      throw new BadRequestException('Account not active');
    }

    const isMatch = await bcrypt.compare(password, exists.password); // trả về boolean,hàm compare so sánh pass vừa nhập vs pass mã khóa dưới db

    if (!isMatch) {
      throw new UnauthorizedException('Email or password incorrect');
    }
    // Create jwt
    const jwtPayload = {
      sub: exists.id,
      email: exists.email,
      role: exists.role,
    };
    const jwtToken = this.jwtService.sign(jwtPayload); // lấy payload đi ký để tạo signature

    return {
      message: 'Login successfully',
      accessToken: jwtToken,
      user: {
        id: exists.id,
        email: exists.email,
        role: exists.role,
      },
    };
  }
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
