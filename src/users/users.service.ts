import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AdminChangePasswordDto } from './dto/admin.change-password.dto.js';
import passport from 'passport';
import { ToggleActiveDto } from './dto/togggle-active.dto.js';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, password, fullName, phone, role } = createUserDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (user) {
      throw new BadRequestException('Account already exist');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.create({
      email,
      password: hashPassword,
      phone,
      fullName,
      role: role || 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.userRepository.save(newUser);
    return {
      message: 'Create account successfully',
      User: {
        email: email,
        password: password,
        phone: phone,
        fullName: fullName,
        role: role,
      },
    };
  }

  async findAll(queryParams: any) {
    const where: Record<string, any> = {};
    if (queryParams.email) {
      where.email = queryParams.email;
    }
    if (queryParams.role) {
      where.role = queryParams.role;
    }
    if (queryParams.phone) {
      where.phone = queryParams.phone;
    }
    const users = await this.userRepository.find({
      where,
    });

    return users;
  }

  async getUser(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    ((user.email = updateUserDto.email || user.email),
      (user.fullName = updateUserDto.email || user.fullName),
      (user.phone = updateUserDto.email || user.phone),
      (user.role = updateUserDto.email || user.role));
    await this.userRepository.save(user);
    return {
      message: 'Update successfully',
    };
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.userRepository.remove(user);
    return {
      message: 'Delete successfully',
    };
  }
  async getProfile(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    const avatarUrl = `${this.configService.get<string>('BASE_URL')}/${user?.avatar}`;
    return {
      id: user?.id,
      email: user?.email,
      fullName: user?.fullName,
      phone: user?.phone,
      role: user?.role,
      avatar: user?.avatar ? avatarUrl : null,
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
  async adminChangePassword(adminChangePasswordDto: AdminChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: adminChangePasswordDto.userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.isActive) {
      throw new BadRequestException('User is not active');
    }

    if (
      adminChangePasswordDto.newPassword !==
      adminChangePasswordDto.confirmPassword
    ) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    const isMatchNewPassword = await bcrypt.compare(
      adminChangePasswordDto.newPassword,
      user.password,
    );
    if (isMatchNewPassword) {
      throw new BadRequestException('New password is the same as old password');
    }

    const newHashedPassword = await bcrypt.hash(
      adminChangePasswordDto.newPassword,
      10,
    );
    user.password = newHashedPassword;
    user.updatedAt = new Date();

    await this.userRepository.save(user);
    return {
      message: 'Password changed successfully',
    };
  }
  async toggleAcive(id: string, toggleActiveDto: ToggleActiveDto) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.isActive = toggleActiveDto.isActive;
    user.updatedAt = new Date();
    await this.userRepository.save(user);
    return {
      message: 'User status changed successfully',
    };
  }
}
