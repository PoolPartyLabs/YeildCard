import { Module } from '@nestjs/common';
import { GnosisTopUpModule } from './gnosis-top-up/gnosis-top-up.module';
import { DebridgeModule } from './debridge/debridge.module';

@Module({
  imports: [GnosisTopUpModule, DebridgeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
