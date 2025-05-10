"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GnosisTopUpService = void 0;
const common_1 = require("@nestjs/common");
const debridge_service_1 = require("../debridge/debridge.service");
let GnosisTopUpService = class GnosisTopUpService {
    debridgeService;
    constructor(debridgeService) {
        this.debridgeService = debridgeService;
    }
    async gnosisTopUp(dto) {
        return this.debridgeService.executeBridgeOrder(dto.sender, dto.gnosisRecipient, dto.amountInt);
    }
};
exports.GnosisTopUpService = GnosisTopUpService;
exports.GnosisTopUpService = GnosisTopUpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [debridge_service_1.DebridgeService])
], GnosisTopUpService);
//# sourceMappingURL=gnosis-top-up.service.js.map