'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approve = approve;
const ABI_1 = require("./ABI");
const core_1 = require("@wagmi/core");
const wagmi_1 = require("./wagmi");
const actions_1 = require("wagmi/actions");
async function approve(address, spender, tokenAddress, amount) {
    const { request } = await (0, core_1.simulateContract)(wagmi_1.wagmiConfig, {
        abi: ABI_1.IERC20_ABI,
        account: address,
        address: tokenAddress,
        functionName: 'approve',
        args: [spender, amount],
    });
    return writeContractWithTimeOut(request);
}
async function waitTxReceipt(hash) {
    const receipt = await (0, actions_1.waitForTransactionReceipt)(wagmi_1.wagmiConfig, {
        hash: hash,
        timeout: 5 * 60 * 1000,
    });
    return receipt.status !== 'success'
        ? {
            txHash: receipt.transactionHash,
            failed: true,
        }
        : { txHash: receipt.transactionHash, failed: false };
}
const writeContractWithTimeOut = (request) => {
    return new Promise(async (resolve, reject) => {
        const time = setTimeout(() => {
            reject({
                txHash: `0x0`,
                failed: true,
                details: 'Timeout',
                shortMessage: 'Timeout',
            });
        }, 5 * 60 * 1000);
        try {
            const _hash = await (0, actions_1.writeContract)(wagmi_1.wagmiConfig, request);
            clearTimeout(time);
            resolve(waitTxReceipt(_hash));
        }
        catch (error) {
            clearTimeout(time);
            reject(error);
        }
    });
};
//# sourceMappingURL=contract.js.map