/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'dotenv/config';
import { JsonRpcProvider } from 'ethers';

export async function getJsonRpcProviders(rpcUrls: {
  arbRpcUrl: string;
  gnosisRpcUrl: string;
}) {
  let arbitrumProvider: JsonRpcProvider;
  let gnosisProvider: JsonRpcProvider;
  try {
    console.log(
      `\nAttempting to connect to Arbitrum via: ${rpcUrls.arbRpcUrl}`,
    );
    arbitrumProvider = new JsonRpcProvider(rpcUrls.arbRpcUrl);
    console.log(
      `\nAttempting to connect to Gnosis via: ${rpcUrls.gnosisRpcUrl}`,
    );
    gnosisProvider = new JsonRpcProvider(rpcUrls.gnosisRpcUrl);
    const arbitrumNetwork = await arbitrumProvider.getNetwork();
    console.log(
      `Arbitrum connection successful. (Network: ${arbitrumNetwork.name}, Chain ID: ${arbitrumNetwork.chainId})`,
    );
    const gnosisNetwork = await gnosisProvider.getNetwork();
    console.log(
      `Gnosis connection successful. (Network: ${gnosisNetwork.name}, Chain ID: ${gnosisNetwork.chainId})`,
    );
  } catch (error) {
    console.error(
      `Failed to connect: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw new Error('Could not connect to a Provider.');
  }

  return {
    arbitrumProvider,
    gnosisProvider,
  };
}

export function getEnvConfig() {
  // --- Environment Variable Loading and Validation ---
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
