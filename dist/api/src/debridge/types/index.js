"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDebridgeTokensInfoSchema = exports.chainIdSchema = exports.EVM_ADDRESS_REGEX = exports.SOLANA_ADDRESS_REGEX = void 0;
const zod_1 = require("zod");
exports.SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
exports.EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
exports.chainIdSchema = zod_1.z.string().refine((val) => {
    const num = Number.parseInt(val, 10);
    if (num > 0 && num < 100000) {
        return true;
    }
    if (num >= 100000000) {
        return true;
    }
    if (num === 7565164) {
        return true;
    }
    return false;
}, {
    message: 'Chain ID must be either 1-99999, 7565164 (Solana), or 100000000+',
});
exports.getDebridgeTokensInfoSchema = zod_1.z.object({
    chainId: exports.chainIdSchema.describe("Chain ID to get token information for. Examples: '1' (Ethereum), '56' (BNB Chain), '7565164' (Solana)"),
    tokenAddress: zod_1.z
        .string()
        .optional()
        .describe('Token address to query information for. For EVM chains: use 0x-prefixed address. For Solana: use base58 token address'),
    search: zod_1.z
        .string()
        .optional()
        .describe("Search term to filter tokens by name or symbol (e.g., 'USDC', 'Ethereum')"),
});
//# sourceMappingURL=index.js.map