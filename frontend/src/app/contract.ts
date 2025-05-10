'use client'

import { IERC20_ABI } from './ABI';
import { simulateContract } from '@wagmi/core';
import { wagmiConfig } from './wagmi';
import {
  waitForTransactionReceipt,
  writeContract,
} from 'wagmi/actions';

export async function approve(
  address: `0x${string}`,
  spender: `0x${string}`,
  tokenAddress: string,
  amount: bigint,
): Promise<{ txHash: string; failed: boolean } | undefined> {
  const { request } = await simulateContract(wagmiConfig, {
    abi: IERC20_ABI,
    account: address,
    address: tokenAddress as `0x${string}`,
    functionName: 'approve',
    args: [spender, amount],
  });

  return writeContractWithTimeOut(request);
}

async function waitTxReceipt(hash: string) {
  const receipt = await waitForTransactionReceipt(wagmiConfig, {
    hash: hash as `0x${string}`,
    timeout: 5 * 60 * 1000, // 5 minutes
  });

  return receipt.status !== 'success'
    ? {
        txHash: receipt.transactionHash,
        failed: true,
      }
    : { txHash: receipt.transactionHash, failed: false };
}

const writeContractWithTimeOut = (request: any) => {
  return new Promise<{
    txHash: `0x${string}`;
    failed: boolean;
  }>(async (resolve, reject) => {
    const time = setTimeout(
      () => {
        reject({
          txHash: `0x0`,
          failed: true,
          details: 'Timeout',
          shortMessage: 'Timeout',
        });
      },
      5 * 60 * 1000,
    ); // 5 minutes

    try {
      const _hash = await writeContract(wagmiConfig, request);
      clearTimeout(time);
      resolve(waitTxReceipt(_hash));
    } catch (error) {
      clearTimeout(time);
      reject(error);
    }
  });
};
