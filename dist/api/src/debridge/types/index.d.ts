import { z } from 'zod';
export interface deBridgeChainInfo {
    chainId: string;
    originalChainId: string;
    chainName: string;
}
export interface deBridgeSupportedChainsResponse {
    chains: deBridgeChainInfo[];
}
export interface deBridgeTokenInfo {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    chainId?: string;
}
export interface deBridgeTokensInfoResponse {
    tokens: Record<string, deBridgeTokenInfo>;
}
export interface deBridgeQuoteInput {
    srcChainId: string;
    srcChainTokenIn: string;
    srcChainTokenInAmount: string;
    dstChainId: string;
    dstChainTokenOut: string;
    dstChainTokenOutAmount?: string;
    slippage?: number;
    senderAddress?: string;
}
export interface deBridgeQuoteResponse {
    estimation: {
        srcChainTokenIn: {
            amount: string;
            tokenAddress: string;
            decimals: number;
            symbol: string;
        };
        dstChainTokenOut: {
            amount: string;
            tokenAddress: string;
            decimals: number;
            symbol: string;
        };
        fees: {
            srcChainTokenIn: string;
            dstChainTokenOut: string;
        };
    };
}
export interface deBridgeOrderInput {
    srcChainId: string;
    srcChainTokenIn: string;
    srcChainTokenInAmount: string;
    dstChainId: string;
    dstChainTokenOut: string;
    dstChainTokenOutRecipient?: string;
    account?: string;
    dstChainTokenOutAmount?: string;
    slippage?: number;
    additionalTakerRewardBps?: number;
    srcIntermediaryTokenAddress?: string;
    dstIntermediaryTokenAddress?: string;
    dstIntermediaryTokenSpenderAddress?: string;
    intermediaryTokenUSDPrice?: number;
    srcAllowedCancelBeneficiary?: string;
    referralCode?: number;
    affiliateFeePercent?: number;
    srcChainOrderAuthorityAddress?: string;
    srcChainRefundAddress?: string;
    dstChainOrderAuthorityAddress?: string;
    prependOperatingExpenses?: boolean;
    deBridgeApp?: string;
}
export interface deBridgeHookInput extends deBridgeOrderInput {
    dlnHook: {
        type: 'evm_transaction_call';
        data: {
            to: string;
            calldata: string;
            gas: number;
        };
    };
}
export interface deBridgeOrderResponse {
    tx: {
        data: string;
        to: string;
        value: string;
    };
    estimation: {
        srcChainTokenIn: {
            amount: string;
            tokenAddress: string;
            decimals: number;
            symbol: string;
        };
        dstChainTokenOut: {
            amount: string;
            tokenAddress: string;
            decimals: number;
            symbol: string;
        };
        fees: {
            srcChainTokenIn: string;
            dstChainTokenOut: string;
        };
    };
}
export interface deBridgeOrderIdsResponse {
    orderIds: string[];
    errorCode?: number;
    errorMessage?: string;
}
export interface deBridgeOrderStatusResponse {
    orderId: string;
    status: 'None' | 'Created' | 'Fulfilled' | 'SentUnlock' | 'OrderCancelled' | 'SentOrderCancel' | 'ClaimedUnlock' | 'ClaimedOrderCancel';
    srcChainTxHash?: string;
    dstChainTxHash?: string;
    orderLink?: string;
    error?: string;
}
export declare const SOLANA_ADDRESS_REGEX: RegExp;
export declare const EVM_ADDRESS_REGEX: RegExp;
export declare const chainIdSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const getDebridgeTokensInfoSchema: z.ZodObject<{
    chainId: z.ZodEffects<z.ZodString, string, string>;
    tokenAddress: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    chainId: string;
    tokenAddress?: string | undefined;
    search?: string | undefined;
}, {
    chainId: string;
    tokenAddress?: string | undefined;
    search?: string | undefined;
}>;
export type GetDebridgeTokensInfoParams = z.infer<typeof getDebridgeTokensInfoSchema>;
