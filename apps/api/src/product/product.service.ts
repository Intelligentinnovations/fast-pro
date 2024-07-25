import { IServiceHelper } from '@backend-template/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { UserRepo } from '../repository/user';
import { SecretsService } from '../secrets/secrets.service';

@Injectable()
export class ProductService {
  constructor(
    private userRepo: UserRepo,
    private secrets: SecretsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async createProduct(): Promise<IServiceHelper> {
    return {
      status: 'successful',
      message: 'If you have an account, An Otp has been sent to your email.',
    };
  }
}
