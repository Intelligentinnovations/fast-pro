import { SetMetadata } from '@nestjs/common';

import {Permission} from '../../utils/types/permission'
export const PERMISSION_KEY = 'permission';
export const RequiredPermission = (requiredPermission: Permission ) => SetMetadata(PERMISSION_KEY, requiredPermission);
