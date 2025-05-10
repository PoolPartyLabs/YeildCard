'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const contract_1 = require("./contract");
const GnosisParty_1 = require("./GnosisParty");
const TokenUSDCAmount_1 = require("./TokenUSDCAmount");
const sendTopUpRequest = async ({ wallet, amountUsdc }) => {
    const approvalReceipt = await (0, contract_1.approve)(wallet, (process.env.NEXT_PUBLIC_TOP_UP_GAS_SPONSOR || ''), "0xaf88d065e77c8cc2239327c5edb3a432268e5831", amountUsdc);
    if (approvalReceipt?.failed) {
        throw new Error("Transaction 'approval' failed");
    }
    await fetch(process.env.NEXT_PUBLIC_GNOSIS_TOP_UP_API || "", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            sender: wallet,
            amount: amountUsdc.toString(),
            gnosisRecipient: process.env.NEXT_PUBLIC_GNOSIS_RECIPIENT || ''
        }),
    });
};
function Home() {
    return (<div className="absolute z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0  gap-[9px] rounded-3xl bg-[#12131a] border border-[#273345]">
            <div className="flex flex-col justify-start items-start w-[320px] md:w-[445px] overflow-hidden rounded-2xl bg-[#12131a]">
              <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative p-6 border-t-0 border-r-0 border-b border-l-0 border-[#273345]">
                <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-8 h-8 gap-0.5 p-2 rounded-[1000px]"/>
                <p className="flex-grow w-[333px] text-xl font-medium text-center text-white">
                  Collect fees
                </p>
                <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-0.5 p-2 rounded-[1000px] cursor-pointer">
                  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-grow-0 flex-shrink-0 w-4 h-4 relative" preserveAspectRatio="xMidYMid meet">
                    <path fillRule="evenodd" clipRule="evenodd" d="M13.6872 3.02024C13.8825 2.82498 13.8825 2.5084 13.6872 2.31313C13.4919 2.11787 13.1754 2.11787 12.9801 2.31313L8.00033 7.29291L3.02055 2.31313C2.82528 2.11787 2.5087 2.11787 2.31344 2.31313C2.11818 2.5084 2.11818 2.82498 2.31344 3.02024L7.29322 8.00002L2.31344 12.9798C2.11818 13.1751 2.11818 13.4916 2.31344 13.6869C2.5087 13.8822 2.82528 13.8822 3.02055 13.6869L8.00033 8.70713L12.9801 13.6869C13.1754 13.8822 13.4919 13.8822 13.6872 13.6869C13.8825 13.4916 13.8825 13.1751 13.6872 12.9798L8.70743 8.00002L13.6872 3.02024Z" fill="#9CA3AF"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-5 p-6">
                <TokenUSDCAmount_1.default amount={'$30.00'}/>
                <GnosisParty_1.default onClick={() => sendTopUpRequest({
            wallet: "0x3429fb3624D98068fc80ECCf0e4f5C586104D259",
            amountUsdc: BigInt(30000000),
        })}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map