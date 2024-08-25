import { Module } from '@nestjs/common';

import { InviteRepo } from '../repository/invite';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [],
  controllers: [SettingsController],
  providers: [SettingsService, InviteRepo],
  exports: [SettingsService],
})
export class SettingsModule {}
