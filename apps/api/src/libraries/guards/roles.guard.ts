import { CanActivate, ExecutionContext,ForbiddenException,Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserData } from '../../utils/types/user.type';
import { PERMISSION_KEY } from './role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermission) {
      return true;
    }
    const { user}  = context.switchToHttp().getRequest();
    const { permissions: userPermission} = user as UserData

    const hasPermission = userPermission.some(p => p.name === requiredPermission)
    if(hasPermission) return  true
    throw new ForbiddenException('Insufficient permission');
  }
}
