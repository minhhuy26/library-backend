import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { ROLE_KEYS } from '../auth/decorator/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';

@Injectable()
export class RolesGuard implements CanActivate {
  //CanActivate là interface quy định Guard,class extends phải return về boolean
  constructor(private reflector: Reflector) {} // là  cụ tích hợp sẵn của NestJS dùng để đọc các metadata
  canActivate(context: ExecutionContext): boolean {
    //Đây là hàm cốt lõi của Guard. Nếu nó trả về true, request được phép đi tiếp vào hệ thống.
    //Nếu false, request bị chặn lại ngay lập tức (thường trả về lỗi HTTP 403 Forbidden).
    // B1: Lay role trong controller
    const controllerRoles = this.reflector.getAllAndOverride<Role[]>( // controllerRoles thành arr chứa role users
      ROLE_KEYS,
      [context.getHandler(), context.getClass()],
      /** 
    *Hàm reflector.getAllAndOverride sẽ tìm kiếm xem API hiện tại (context.getHandler())
     hoặc toàn bộ Class chứa API đó (context.getClass()) có gắn metadata ROLE_KEYS không.
    Nếu trả về undefined (không yêu cầu role nào), Guard sẽ trả về true để cho phép tất cả mọi người đi qua. */
    );
    // Neu controller khong can Role, thi cho phep truy cap
    if (!controllerRoles) {
      return true;
    }

    // B2: Lay role cua user trong token
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Payload trong JWT,cái ở strategy đã validate
    // Kiem tra khong co user hoac user khong co role nao
    if (!user || !user.role) {
      return false;
    }

    // B3: Kiem tra user co quyen truy cap vao controller khong
    // user.role la string, controllerRole la array
    return controllerRoles.includes(user.role);
  }
}
/**Trong đoạn code của bạn, ExecutionContext thực hiện hai nhiệm vụ chính:
Lấy đối tượng HTTP Request bằng context.switchToHttp().getRequest() để bạn có thể trích xuất req.user.
Xác định chính xác Controller (context.getClass()) và API/Hàm (context.getHandler()) đang được gọi,
 từ đó giúp Reflector đọc đúng metadata @Roles gắn trên API đó. */
