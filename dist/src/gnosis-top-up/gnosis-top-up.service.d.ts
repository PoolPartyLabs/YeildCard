import { DebridgeService } from 'src/debridge/debridge.service';
import { GnosisTopUpDto } from './dto/gnosis-top-up.dto';
export declare class GnosisTopUpService {
    private readonly debridgeService;
    constructor(debridgeService: DebridgeService);
    gnosisTopUp(dto: GnosisTopUpDto): Promise<any>;
}
