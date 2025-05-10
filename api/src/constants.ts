import { InterfaceAbi } from 'ethers';

export const DEBRIDGE_API = 'https://dln.debridge.finance/v1.0';
export const erc20Abi: InterfaceAbi = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function allowance(address owner, address spender) view returns (uint256)', // Added
  // State-Changing Functions
  'function approve(address spender, uint256 amount) returns (bool)', // Added
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
];
