"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GnosisTopUpModule = void 0;
const common_1 = require("@nestjs/common");
const gnosis_top_up_controller_1 = require("./gnosis-top-up.controller");
const gnosis_top_up_service_1 = require("./gnosis-top-up.service");
const debridge_module_1 = require("../debridge/debridge.module");
let GnosisTopUpModule = class GnosisTopUpModule {
};
exports.GnosisTopUpModule = GnosisTopUpModule;
exports.GnosisTopUpModule = GnosisTopUpModule = __decorate([
    (0, common_1.Module)({
        imports: [debridge_module_1.DebridgeModule],
        controllers: [gnosis_top_up_controller_1.GnosisTopUpController],
        providers: [gnosis_top_up_service_1.GnosisTopUpService],
    })
], GnosisTopUpModule);
//# sourceMappingURL=gnosis-top-up.module.js.map