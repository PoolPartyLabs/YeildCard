import { Injectable } from '@nestjs/common';
import { DebridgeService } from 'src/debridge/debridge.service';
import { GnosisTopUpDto } from './dto/gnosis-top-up.dto';

@Injectable()
export class GnosisTopUpService {
  constructor(private readonly debridgeService: DebridgeService) {}

  async gnosisTopUp(dto: GnosisTopUpDto): Promise<any> {
    return this.debridgeService.executeBridgeOrder(
      dto.sender,
      dto.gnosisRecipient,
      dto.amountInt,
    );
  }
}
