import 'fastify';

import { UserData } from '../utils/types/user.type';

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserData;
  }
}
