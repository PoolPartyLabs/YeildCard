export declare function approve(address: `0x${string}`, spender: `0x${string}`, tokenAddress: string, amount: bigint): Promise<{
    txHash: string;
    failed: boolean;
} | undefined>;
