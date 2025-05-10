import { arbitrum, arbitrumSepolia, Chain, mainnet } from 'wagmi/chains';

import { createConfig, http } from 'wagmi';
import { getDefaultConfig } from 'connectkit';
let chains: readonly [Chain, ...Chain[]];
chains = [arbitrum, mainnet];

export const wagmiConfig = (() => {
  const httpChainAPIUrl = process.env.NEXT_PUBLIC_HTTP_CHAIN_API_URL;
  return createConfig(
    getDefaultConfig({
      // Your dApps chains
      chains,
      transports: {
        // RPC URL for each chain
        [mainnet.id]: http(httpChainAPIUrl),
        [arbitrum.id]: http(httpChainAPIUrl),
        [arbitrumSepolia.id]: http(httpChainAPIUrl),
      },

      walletConnectProjectId:
        process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

      // Required App Info
      appName: 'Pool Party YieldCard',
    }),
  );
})();
