import { Module } from '@nestjs/common';
import { DebridgeService } from './debridge.service';

@Module({
  providers: [DebridgeService]
})
export class DebridgeModule {}
