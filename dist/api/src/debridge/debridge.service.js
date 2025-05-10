"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebridgeService = void 0;
const common_1 = require("@nestjs/common");
require("dotenv/config");
const ethers_1 = require("ethers");
const createDebridgeBridgeOrder_1 = require("./createDebridgeBridgeOrder");
const constants_1 = require("../constants");
const utils_1 = require("./utils");
const USDC_DECIMALS = 6;
const ARB_USDC = '0xaf88d065e77c8cc2239327c5edb3a432268e5831';
const GNOSIS_USDC = '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83';
let DebridgeService = class DebridgeService {
    async executeBridgeOrder(sender, gnosisRecipient, amountToSend) {
        const { payMaster, payMasterAddress } = await this.payMaster();
        const amountBigInt = BigInt(amountToSend);
        await this.transferFromUSDC({
            signer: payMaster,
            tokenAddress: ARB_USDC,
            fromAddress: sender,
            recipientAddress: payMasterAddress,
            amount: amountBigInt,
        });
        console.log('\n--- Preparing deBridge Order ---', amountBigInt.toString());
        const orderInput = {
            srcChainId: '42161',
            srcChainTokenIn: ARB_USDC,
            srcChainTokenInAmount: amountBigInt.toString(),
            dstChainId: '100000002',
            dstChainTokenOut: GNOSIS_USDC,
            dstChainTokenOutRecipient: gnosisRecipient,
            account: payMasterAddress,
            srcChainOrderAuthorityAddress: payMasterAddress,
            dstChainOrderAuthorityAddress: payMasterAddress,
        };
        console.log('\nCreating deBridge order with input:', JSON.stringify(orderInput, null, 2));
        const order = await (0, createDebridgeBridgeOrder_1.createDebridgeBridgeOrder)(orderInput);
        if (!order || !order.tx || !order.tx.to || !order.tx.data) {
            throw new Error('Invalid transaction request object from createDebridgeBridgeOrder.');
        }
        console.log('\nOrder Estimation:', order.estimation);
        const transactionRequest = order.tx;
        console.log('\nTransaction Request Object:', transactionRequest);
        const spenderAddress = transactionRequest.to;
        if (!spenderAddress) {
            throw new Error("Transaction request is missing the 'to' address (spender).");
        }
        await this.approveToken({
            payMaster,
            orderInput,
            payMasterAddress,
            spenderAddress,
            order,
        });
        const receipt = await this.sendMainBridgeTransaction({
            payMaster,
            transactionRequest,
        });
        console.log('\n--- Script finished ---');
        return {
            message: 'Transaction completed successfully.',
            transactionHash: receipt?.hash,
        };
    }
    async payMaster() {
        const { privateKey, arbRpcUrl, gnosisRpcUrl } = (0, utils_1.getEnvConfig)();
        const { arbitrumProvider } = await (0, utils_1.getJsonRpcProviders)({
            arbRpcUrl: arbRpcUrl || '',
            gnosisRpcUrl: gnosisRpcUrl || '',
        });
        const wallet = new ethers_1.Wallet(privateKey || '');
        const payMaster = wallet.connect(arbitrumProvider);
        const payMasterAddress = await payMaster.getAddress();
        console.log(`\nWallet Address (PayMaster): ${payMasterAddress}`);
        return { payMaster, payMasterAddress };
    }
    async sendMainBridgeTransaction({ payMaster, transactionRequest, }) {
        if (!payMaster) {
            throw new Error('PayMaster is not defined. Cannot send transaction.');
        }
        try {
            console.log('\n--- Sending Main Bridge Transaction ---');
            console.log('Submitting the deBridge transaction request...');
            const txResponse = await payMaster.sendTransaction(transactionRequest);
            console.log(`Main transaction sent successfully!`);
            console.log(` --> Transaction Hash: ${txResponse.hash}`);
            console.log(` --> View on ArbScan: https://arbiscan.io/tx/${txResponse.hash}`);
            console.log('\nWaiting for main transaction to be mined (awaiting 1 confirmation)...');
            const txReceipt = await txResponse.wait();
            if (txReceipt) {
                console.log('\nMain transaction mined successfully!');
                console.log(` Status: ${txReceipt.status === 1 ? '✅ Success' : '❌ Failed'}`);
                console.log(` Block number: ${txReceipt.blockNumber}`);
                console.log(` Gas used: ${txReceipt.gasUsed.toString()}`);
                if (txReceipt.status === 1) {
                    return txReceipt;
                }
                throw new Error(`Main transaction failed. Status: ${txReceipt.status}`);
            }
            else {
                console.error('Main transaction receipt was null. Transaction might have been dropped or replaced.');
                console.error('Check the explorer link above for the final status of the hash:', txResponse.hash);
                throw new Error('Main transaction receipt was null. Transaction might have been dropped or replaced.');
            }
        }
        catch (error) {
            console.error('\n🚨 Error sending or waiting for the main transaction:');
            if (error instanceof Error) {
                console.error(` Message: ${error.message}`);
            }
            else {
                console.error(' An unexpected error occurred:', error);
            }
            process.exitCode = 1;
            throw error;
        }
    }
    async approveToken({ payMaster, orderInput, payMasterAddress, spenderAddress, order, }) {
        try {
            console.log(`\n--- Checking/Setting Token Approval ---`);
            console.log(` Token to approve: ${orderInput.srcChainTokenIn} (Gnosis USDC)`);
            console.log(` Spender address: ${spenderAddress}`);
            const tokenContract = new ethers_1.Contract(orderInput.srcChainTokenIn, constants_1.erc20Abi, payMaster);
            const requiredAmountBigInt = BigInt(order.estimation.srcChainTokenIn.amount);
            console.log(` Amount required: ${(0, ethers_1.formatUnits)(requiredAmountBigInt, USDC_DECIMALS)} USDC`);
            console.log(`Checking current allowance...`);
            const currentAllowance = await tokenContract.allowance(payMasterAddress, spenderAddress);
            console.log(` Current allowance: ${(0, ethers_1.formatUnits)(currentAllowance, USDC_DECIMALS)} USDC`);
            if (currentAllowance < requiredAmountBigInt) {
                console.log('Allowance is insufficient. Sending approve transaction...');
                const approveTxResponse = await tokenContract.approve(spenderAddress, requiredAmountBigInt);
                console.log(`Approve transaction sent!`);
                console.log(` --> Transaction Hash: ${approveTxResponse.hash}`);
                console.log(` --> View on ArbScan: https://arbiscan.io/tx/${approveTxResponse.hash}`);
                console.log('Waiting for approve transaction to be mined (awaiting 1 confirmation)...');
                const approveTxReceipt = await approveTxResponse.wait();
                if (approveTxReceipt && approveTxReceipt.status === 1) {
                    console.log('Approve transaction mined successfully! ✅');
                }
                else {
                    throw new Error(`Approve transaction failed or receipt not found. Status: ${approveTxReceipt?.status}`);
                }
            }
            else {
                console.log('Sufficient allowance already granted. Skipping approve transaction. 👍');
            }
        }
        catch (error) {
            console.error('\n🚨 Error during token approval process:');
            if (error instanceof Error) {
                console.error(` Message: ${error.message}`);
            }
            else {
                console.error(' An unexpected error occurred:', error);
            }
            throw new Error('Token approval failed. Cannot proceed with the bridge transaction.');
        }
    }
    async transferFromUSDC({ signer, tokenAddress, fromAddress, recipientAddress, amount, }) {
        try {
            const usdcContract = new ethers_1.Contract(tokenAddress, constants_1.erc20Abi, signer);
            console.log(`\n--- Initiating USDC transferFrom ---`);
            console.log(` From: ${fromAddress}`);
            console.log(` To: ${recipientAddress}`);
            console.log(` Amount: ${amount} USDC (${amount.toString()} atomic units)`);
            const currentAllowance = await usdcContract.allowance(fromAddress, recipientAddress);
            console.log(` Current allowance: ${(0, ethers_1.formatUnits)(currentAllowance, USDC_DECIMALS)} USDC`);
            if (currentAllowance < amount) {
                throw new Error(`Insufficient allowance. The address ${fromAddress} must first approve ${recipientAddress} to spend at least ${amount} USDC`);
            }
            const txResponse = await usdcContract.transferFrom(fromAddress, recipientAddress, amount);
            console.log(`TransferFrom transaction sent successfully!`);
            console.log(` Transaction Hash: ${txResponse.hash}`);
            console.log(` View on ArbScan: https://arbiscan.io/tx/${txResponse.hash}`);
            console.log(`Waiting for transaction to be mined...`);
            const receipt = await txResponse.wait();
            if (receipt && receipt.status === 1) {
                console.log(`TransferFrom successful! ✅`);
                return receipt;
            }
            else {
                throw new Error(`TransferFrom transaction failed. Status: ${receipt?.status}`);
            }
        }
        catch (error) {
            console.error('\n🚨 Error during USDC transferFrom:');
            if (error instanceof Error) {
                console.error(` Message: ${error.message}`);
            }
            else {
                console.error(' An unexpected error occurred:', error);
            }
            throw error;
        }
    }
};
exports.DebridgeService = DebridgeService;
exports.DebridgeService = DebridgeService = __decorate([
    (0, common_1.Injectable)()
], DebridgeService);
//# sourceMappingURL=debridge.service.js.map