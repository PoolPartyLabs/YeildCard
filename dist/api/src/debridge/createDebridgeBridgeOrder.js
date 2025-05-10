"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDebridgeBridgeOrder = createDebridgeBridgeOrder;
const constants_1 = require("../constants");
async function createDebridgeBridgeOrder(params) {
    if (params.srcChainId === params.dstChainId) {
        throw new Error('Source and destination chains must be different');
    }
    const queryParamsObj = {
        srcChainId: params.srcChainId,
        srcChainTokenIn: params.srcChainTokenIn,
        srcChainTokenInAmount: params.srcChainTokenInAmount,
        dstChainId: params.dstChainId,
        dstChainTokenOut: params.dstChainTokenOut,
        dstChainTokenOutRecipient: params.dstChainTokenOutRecipient,
        dstChainTokenOutAmount: params.dstChainTokenOutAmount || 'auto',
        senderAddress: params.account,
        srcChainOrderAuthorityAddress: params.srcChainOrderAuthorityAddress || params.account,
        srcChainRefundAddress: params.account,
        dstChainOrderAuthorityAddress: params.dstChainOrderAuthorityAddress || params.dstChainTokenOutRecipient,
        referralCode: '',
        prependOperatingExpenses: 'true',
    };
    const queryParams = new URLSearchParams();
    Object.entries(queryParamsObj).forEach(([key, value]) => {
        if (value !== undefined) {
            queryParams.append(key, value.toString());
        }
    });
    const response = await fetch(`${constants_1.DEBRIDGE_API}/dln/order/create-tx?${queryParams}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create bridge order: ${response.statusText}. ${errorText}`);
    }
    const data = await response.json();
    if (data.error) {
        throw new Error(`DeBridge API Error: ${data.error}`);
    }
    if (data.tx?.data) {
        data.tx.data = data.tx.data.toString();
    }
    return data;
}
//# sourceMappingURL=createDebridgeBridgeOrder.js.map