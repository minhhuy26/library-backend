import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async getProfile(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    return {
      id: user?.id,
      email: user?.email,
      fullName: user?.fullName,
      phone: user?.phone,
      role: user?.role,
    };
  }
  async changePassword(userReq: any, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: userReq.id,
      },
    });
    // B1:check user exist
    if (!user) {
      throw new BadRequestException('User not exist');
    }
    // B2: check user active
    if (!user.isActive) {
      throw new BadRequestException('User is not active');
    }
    // B3: check oldpassword
    const isMatchOldPassword = await bcrypt.compare(
      changePasswordDto.oldPassWord,
      user.password,
    );
    if (!isMatchOldPassword) {
      throw new BadRequestException('Incorrect password');
    }
    // B4: compare newPassword and confirmPassword
    if (changePasswordDto.newPassWord !== changePasswordDto.confirmPassWord) {
      throw new BadRequestException(
        'New Password and Confirm Password do not match',
      );
    }
    // B5: compare newPassword and oldPassword -> not match
    const isMatchNewPassword = await bcrypt.compare(
      changePasswordDto.newPassWord,
      changePasswordDto.oldPassWord,
    );
    if (isMatchNewPassword) {
      throw new BadRequestException('newPassWord is the same as oldPassWord');
    }
    // B6:Hash newpassword
    const HashNewPassword = await bcrypt.hash(
      changePasswordDto.newPassWord,
      10,
    );
    user.password = HashNewPassword;
    await this.userRepository.save(user);
    return {
      message: 'Password change successfully',
    };
  }
  async changeAvatar(userReq: any, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({
      where: {
        id: userReq.id,
      },
    });
    if (!user) {
      throw new BadRequestException('User not exist');
    }
    if (!user.isActive) {
      throw new BadRequestException('User is not active');
    }
    user.avatar = file.path;
    user.updatedAt = new Date();
    await this.userRepository.save(user);
    return {
      message: 'Avatar change successfully',
    };
  }
}
