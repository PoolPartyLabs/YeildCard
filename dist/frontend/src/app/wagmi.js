"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wagmiConfig = void 0;
const chains_1 = require("wagmi/chains");
const wagmi_1 = require("wagmi");
const connectkit_1 = require("connectkit");
let chains;
chains = [chains_1.arbitrum, chains_1.mainnet];
exports.wagmiConfig = (() => {
    const httpChainAPIUrl = process.env.NEXT_PUBLIC_HTTP_CHAIN_API_URL;
    return (0, wagmi_1.createConfig)((0, connectkit_1.getDefaultConfig)({
        chains,
        transports: {
            [chains_1.mainnet.id]: (0, wagmi_1.http)(httpChainAPIUrl),
            [chains_1.arbitrum.id]: (0, wagmi_1.http)(httpChainAPIUrl),
            [chains_1.arbitrumSepolia.id]: (0, wagmi_1.http)(httpChainAPIUrl),
        },
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
        appName: 'Pool Party YieldCard',
    }));
})();
//# sourceMappingURL=wagmi.js.map