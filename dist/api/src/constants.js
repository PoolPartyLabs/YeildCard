"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.erc20Abi = exports.DEBRIDGE_API = void 0;
exports.DEBRIDGE_API = 'https://dln.debridge.finance/v1.0';
exports.erc20Abi = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function transferFrom(address from, address to, uint256 amount) returns (bool)',
];
//# sourceMappingURL=constants.js.map