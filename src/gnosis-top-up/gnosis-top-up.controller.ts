import { Body, Controller, Post } from '@nestjs/common';
import { GnosisTopUpDto } from './dto/gnosis-top-up.dto';
import { GnosisTopUpService } from './gnosis-top-up.service';

@Controller('gnosis-top-up')
export class GnosisTopUpController {
  constructor(private readonly gnosisTopUpService: GnosisTopUpService) {}
  @Post()
  gnosisTopUp(@Body() dto: GnosisTopUpDto): Promise<any> {
    return this.gnosisTopUpService.gnosisTopUp(dto);
  }
}
