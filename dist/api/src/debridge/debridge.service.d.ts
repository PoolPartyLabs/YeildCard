import 'dotenv/config';
export declare class DebridgeService {
    executeBridgeOrder(sender: string, gnosisRecipient: string, amountToSend: string): Promise<{
        message: string;
        transactionHash: string | undefined;
    }>;
    private payMaster;
    private sendMainBridgeTransaction;
    private approveToken;
    private transferFromUSDC;
}
