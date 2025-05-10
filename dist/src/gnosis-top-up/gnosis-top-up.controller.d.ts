import { GnosisTopUpDto } from './dto/gnosis-top-up.dto';
import { GnosisTopUpService } from './gnosis-top-up.service';
export declare class GnosisTopUpController {
    private readonly gnosisTopUpService;
    constructor(gnosisTopUpService: GnosisTopUpService);
    gnosisTopUp(dto: GnosisTopUpDto): Promise<any>;
}
