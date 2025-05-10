import 'dotenv/config';
export declare function getJsonRpcProviders(rpcUrls: {
    arbRpcUrl: string;
    gnosisRpcUrl: string;
}): Promise<{
    arbitrumProvider: JsonRpcProvider;
    gnosisProvider: JsonRpcProvider;
}>;
export declare function getEnvConfig(): {
    privateKey: string | undefined;
    arbRpcUrl: string | undefined;
    gnosisRpcUrl: string | undefined;
};
