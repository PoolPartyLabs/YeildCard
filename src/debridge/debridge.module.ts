import { Module } from '@nestjs/common';
import { DebridgeService } from './debridge.service';

@Module({
  providers: [DebridgeService],
  exports: [DebridgeService],
})
export class DebridgeModule {}
