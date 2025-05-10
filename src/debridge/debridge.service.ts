/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import {
  Wallet,
  Contract,
  formatUnits,
  TransactionResponse,
  TransactionReceipt,
  TransactionRequest,
  ContractRunner,
  AddressLike,
} from 'ethers';
import { createDebridgeBridgeOrder } from './createDebridgeBridgeOrder';
import { deBridgeOrderInput, deBridgeOrderResponse } from './types';
import { erc20Abi } from '../constants';
import { getEnvConfig, getJsonRpcProviders } from './utils';

const USDC_DECIMALS = 6;
const ARB_USDC = '0xaf88d065e77c8cc2239327c5edb3a432268e5831';
const GNOSIS_USDC = '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83';

@Injectable()
export class DebridgeService {
  async executeBridgeOrder(
    sender: string,
    gnosisRecipient: string,
    amountToSend: string,
  ) {
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

    const orderInput: deBridgeOrderInput = {
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

    console.log(
      '\nCreating deBridge order with input:',
      JSON.stringify(orderInput, null, 2),
    );
    const order = await createDebridgeBridgeOrder(orderInput);

    if (!order || !order.tx || !order.tx.to || !order.tx.data) {
      throw new Error(
        'Invalid transaction request object from createDebridgeBridgeOrder.',
      );
    }

    console.log('\nOrder Estimation:', order.estimation);
    const transactionRequest: TransactionRequest = order.tx;
    console.log('\nTransaction Request Object:', transactionRequest);

    // --- Approve Token Spending ---
    const spenderAddress = transactionRequest.to; // The deBridge contract address needing approval
    if (!spenderAddress) {
      throw new Error(
        "Transaction request is missing the 'to' address (spender).",
      );
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

  private async payMaster() {
    const { privateKey, arbRpcUrl, gnosisRpcUrl } = getEnvConfig();

    const { arbitrumProvider } = await getJsonRpcProviders({
      arbRpcUrl: arbRpcUrl || '',
      gnosisRpcUrl: gnosisRpcUrl || '',
    });

    // --- Wallet and Signer Setup ---
    const wallet = new Wallet(privateKey || '');
    const payMaster = wallet.connect(arbitrumProvider);
    const payMasterAddress = await payMaster.getAddress();
    console.log(`\nWallet Address (PayMaster): ${payMasterAddress}`);
    return { payMaster, payMasterAddress };
  }

  private async sendMainBridgeTransaction({
    payMaster,
    transactionRequest,
  }: {
    payMaster: Wallet;
    transactionRequest: TransactionRequest;
  }): Promise<TransactionReceipt | null> {
    if (!payMaster) {
      throw new Error('PayMaster is not defined. Cannot send transaction.');
    }
    // --- Send Main Bridge Transaction ---
    // This part only runs if the approval check/transaction above was successful
    try {
      console.log('\n--- Sending Main Bridge Transaction ---');
      console.log('Submitting the deBridge transaction request...');

      const txResponse: TransactionResponse =
        await payMaster.sendTransaction(transactionRequest);

      console.log(`Main transaction sent successfully!`);
      console.log(` --> Transaction Hash: ${txResponse.hash}`);

      console.log(
        ` --> View on ArbScan: https://arbiscan.io/tx/${txResponse.hash}`,
      );

      console.log(
        '\nWaiting for main transaction to be mined (awaiting 1 confirmation)...',
      );
      const txReceipt: TransactionReceipt | null = await txResponse.wait();

      if (txReceipt) {
        console.log('\nMain transaction mined successfully!');
        console.log(
          ` Status: ${txReceipt.status === 1 ? '✅ Success' : '❌ Failed'}`,
        );
        console.log(` Block number: ${txReceipt.blockNumber}`);
        console.log(` Gas used: ${txReceipt.gasUsed.toString()}`);
        if (txReceipt.status === 1) {
          return txReceipt;
        }
        throw new Error(`Main transaction failed. Status: ${txReceipt.status}`);
      } else {
        console.error(
          'Main transaction receipt was null. Transaction might have been dropped or replaced.',
        );
        console.error(
          'Check the explorer link above for the final status of the hash:',
          txResponse.hash,
        );
        throw new Error(
          'Main transaction receipt was null. Transaction might have been dropped or replaced.',
        );
      }
    } catch (error) {
      console.error('\n🚨 Error sending or waiting for the main transaction:');
      if (error instanceof Error) {
        console.error(` Message: ${error.message}`);
      } else {
        console.error(' An unexpected error occurred:', error);
      }
      process.exitCode = 1; // Indicate failure
      throw error; // Rethrow the error to propagate it
    }
  }

  private async approveToken({
    payMaster,
    orderInput,
    payMasterAddress,
    spenderAddress,
    order,
  }: {
    payMaster: Wallet;
    orderInput: deBridgeOrderInput;
    payMasterAddress: string;
    spenderAddress: AddressLike | null | undefined;
    order: deBridgeOrderResponse;
  }) {
    try {
      console.log(`\n--- Checking/Setting Token Approval ---`);
      console.log(
        ` Token to approve: ${orderInput.srcChainTokenIn} (Gnosis USDC)`,
      );
      console.log(` Spender address: ${spenderAddress}`);

      const tokenContract = new Contract(
        orderInput.srcChainTokenIn,
        erc20Abi,
        payMaster,
      );
      const requiredAmountBigInt = BigInt(
        order.estimation.srcChainTokenIn.amount,
      );
      console.log(
        ` Amount required: ${formatUnits(requiredAmountBigInt, USDC_DECIMALS)} USDC`,
      );

      console.log(`Checking current allowance...`);
      const currentAllowance: bigint = await tokenContract.allowance(
        payMasterAddress,
        spenderAddress,
      );
      console.log(
        ` Current allowance: ${formatUnits(currentAllowance, USDC_DECIMALS)} USDC`,
      );

      // Check if current allowance is less than the required amount
      if (currentAllowance < requiredAmountBigInt) {
        console.log(
          'Allowance is insufficient. Sending approve transaction...',
        );

        const approveTxResponse: TransactionResponse =
          await tokenContract.approve(spenderAddress, requiredAmountBigInt);

        console.log(`Approve transaction sent!`);
        console.log(` --> Transaction Hash: ${approveTxResponse.hash}`);
        console.log(
          ` --> View on ArbScan: https://arbiscan.io/tx/${approveTxResponse.hash}`,
        );
        console.log(
          'Waiting for approve transaction to be mined (awaiting 1 confirmation)...',
        );

        // Wait for the approve transaction to be mined
        const approveTxReceipt: TransactionReceipt | null =
          await approveTxResponse.wait();

        if (approveTxReceipt && approveTxReceipt.status === 1) {
          console.log('Approve transaction mined successfully! ✅');
        } else {
          // Throw an error if the approve transaction failed
          throw new Error(
            `Approve transaction failed or receipt not found. Status: ${approveTxReceipt?.status}`,
          );
        }
      } else {
        console.log(
          'Sufficient allowance already granted. Skipping approve transaction. 👍',
        );
      }
    } catch (error) {
      console.error('\n🚨 Error during token approval process:');
      if (error instanceof Error) {
        console.error(` Message: ${error.message}`);
      } else {
        console.error(' An unexpected error occurred:', error);
      }
      // Stop execution if approval fails
      throw new Error(
        'Token approval failed. Cannot proceed with the bridge transaction.',
      );
    }
  }

  private async transferFromUSDC({
    signer,
    tokenAddress,
    fromAddress,
    recipientAddress,
    amount,
  }: {
    signer: ContractRunner;
    tokenAddress: string;
    fromAddress: string;
    recipientAddress: string;
    amount: bigint;
  }): Promise<TransactionReceipt | null> {
    try {
      // Create contract instance
      const usdcContract = new Contract(tokenAddress, erc20Abi, signer);

      console.log(`\n--- Initiating USDC transferFrom ---`);
      console.log(` From: ${fromAddress}`);
      console.log(` To: ${recipientAddress}`);
      console.log(
        ` Amount: ${amount} USDC (${amount.toString()} atomic units)`,
      );

      // Check for allowance first
      const currentAllowance = await usdcContract.allowance(
        fromAddress,
        recipientAddress,
      );
      console.log(
        ` Current allowance: ${formatUnits(currentAllowance, USDC_DECIMALS)} USDC`,
      );

      if (currentAllowance < amount) {
        throw new Error(
          `Insufficient allowance. The address ${fromAddress} must first approve ${recipientAddress} to spend at least ${amount} USDC`,
        );
      }

      // Execute transferFrom
      const txResponse = await usdcContract.transferFrom(
        fromAddress,
        recipientAddress,
        amount,
      );

      console.log(`TransferFrom transaction sent successfully!`);
      console.log(` Transaction Hash: ${txResponse.hash}`);
      console.log(
        ` View on ArbScan: https://arbiscan.io/tx/${txResponse.hash}`,
      );

      console.log(`Waiting for transaction to be mined...`);
      const receipt = await txResponse.wait();

      if (receipt && receipt.status === 1) {
        console.log(`TransferFrom successful! ✅`);
        return receipt;
      } else {
        throw new Error(
          `TransferFrom transaction failed. Status: ${receipt?.status}`,
        );
      }
    } catch (error) {
      console.error('\n🚨 Error during USDC transferFrom:');
      if (error instanceof Error) {
        console.error(` Message: ${error.message}`);
      } else {
        console.error(' An unexpected error occurred:', error);
      }
      throw error;
    }
  }
}
