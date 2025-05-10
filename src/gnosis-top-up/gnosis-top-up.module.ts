import { Module } from '@nestjs/common';
import { GnosisTopUpController } from './gnosis-top-up.controller';
import { GnosisTopUpService } from './gnosis-top-up.service';
import { DebridgeModule } from 'src/debridge/debridge.module';

@Module({
  imports: [DebridgeModule],
  controllers: [GnosisTopUpController],
  providers: [GnosisTopUpService],
})
export class GnosisTopUpModule {}
