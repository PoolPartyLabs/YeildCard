"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJsonRpcProviders = getJsonRpcProviders;
exports.getEnvConfig = getEnvConfig;
require("dotenv/config");
const ethers_1 = require("ethers");
async function getJsonRpcProviders(rpcUrls) {
    let arbitrumProvider;
    let gnosisProvider;
    try {
        console.log(`\nAttempting to connect to Arbitrum via: ${rpcUrls.arbRpcUrl}`);
        arbitrumProvider = new ethers_1.JsonRpcProvider(rpcUrls.arbRpcUrl);
        console.log(`\nAttempting to connect to Gnosis via: ${rpcUrls.gnosisRpcUrl}`);
        gnosisProvider = new ethers_1.JsonRpcProvider(rpcUrls.gnosisRpcUrl);
        const arbitrumNetwork = await arbitrumProvider.getNetwork();
        console.log(`Arbitrum connection successful. (Network: ${arbitrumNetwork.name}, Chain ID: ${arbitrumNetwork.chainId})`);
        const gnosisNetwork = await gnosisProvider.getNetwork();
        console.log(`Gnosis connection successful. (Network: ${gnosisNetwork.name}, Chain ID: ${gnosisNetwork.chainId})`);
    }
    catch (error) {
        console.error(`Failed to connect: ${error instanceof Error ? error.message : String(error)}`);
        throw new Error('Could not connect to a Provider.');
    }
    return {
        arbitrumProvider,
        gnosisProvider,
    };
}
function getEnvConfig() {
    console.log('Loading environment variables...');
    const privateKey = process.env.SIGNER_PK;
    const arbRpcUrl = process.env.ARB_RPC_URL;
    const gnosisRpcUrl = process.env.GNOSIS_RPC_URL;
    let error = '';
    if (!privateKey) {
        error += '\nSIGNER_PK not found in .env file.';
    }
    if (!arbRpcUrl) {
        error += '\nARB_RPC_URL not found in .env file.';
    }
    if (!gnosisRpcUrl) {
        error += '\nGNOSIS_RPC_URL not found in .env file.';
    }
    if (error !== '') {
        throw new Error(`Invalid configuration. ${error}`);
    }
    return {
        privateKey,
        arbRpcUrl,
        gnosisRpcUrl,
    };
}
//# sourceMappingURL=utils.js.map