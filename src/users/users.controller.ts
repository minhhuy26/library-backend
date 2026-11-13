import 'multer';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Role } from '../common/enums/role.enum.js';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../guards/jwt-auth-guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import type { Request, Express } from 'express';

import { ChangePasswordDto } from './dto/change-password.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AdminChangePasswordDto } from './dto/admin.change-password.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ToggleActiveDto } from './dto/togggle-active.dto.js';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // Admin tạo user
  @Post('admin/add-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  // Lấy thông tin cá nhân
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    const user: any = req.user;
    return this.usersService.getProfile(user.id);
  }
  // Cho đổi avatar
  @Patch('change-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatar',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}_${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Invalid file type'), false);
        }
        cb(null, true);
      },
    }),
  )
  changeAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    const userReq = req.user;
    return this.usersService.changeAvatar(userReq, file);
  }
  // Admin đổi mật khẩu cho users
  @Patch('/admin/change-user-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminChangePassword(@Body() adminChangePasswordDto: AdminChangePasswordDto) {
    return this.usersService.adminChangePassword(adminChangePasswordDto);
  }
  // Tìm danh sách users
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LIBRARIAN)
  findAll(
    @Query('email') email: string,
    @Query('phone') phone: string,
    @Query('role') role: string,
  ) {
    const queryParam = {
      email,
      phone,
      role,
    };
    return this.usersService.findAll(queryParam);
  }
  // Lấy thông tin theo id
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.LIBRARIAN)
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }
  // Đổi password
  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userReq = req.user;
    return this.usersService.changePassword(userReq, changePasswordDto);
  }
  // Cập nhật thông tin theo id
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  // Xóa user theo id
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  toggleAcive(@Param('id') id: string, toggleActiveDto: ToggleActiveDto) {
    return this.usersService.toggleAcive(id, toggleActiveDto);
  }
}
