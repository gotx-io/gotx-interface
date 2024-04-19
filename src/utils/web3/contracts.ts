import { Result } from '@ethersproject/abi'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { Provider, Web3Provider } from '@ethersproject/providers'

import ERC20_ABI from 'abis/ERC20.json'
import LIQUIDITY_VAULT_ABI from 'abis/LiquidityVault.json'
import MULTICALL_ABI from 'abis/Multicall.json'
import PERPS_MARKET_ABI from 'abis/PerpsMarket.json'
import USDC_ABI from 'abis/USDC.json'
import { CONTRACT_KEYS } from 'utils/config/keys'
import { ContractInfo } from 'utils/web3/types'

import { MODE_MAINNET, MODE_TESTNET, SEPOLIA } from './chains'

export interface ContractKey {
  key: string
  chainId: number
}

export const CONTRACT_ABIS: {
  [key: string]: any
} = {
  [CONTRACT_KEYS.MULTICALL]: MULTICALL_ABI,
  [CONTRACT_KEYS.USDC]: USDC_ABI,
  [CONTRACT_KEYS.ERC20]: ERC20_ABI,
  [CONTRACT_KEYS.LIQUIDITY_VAULT]: LIQUIDITY_VAULT_ABI,
  [CONTRACT_KEYS.PERPS_MARKET]: PERPS_MARKET_ABI,
}

export const CONTRACT_ADDRESSES: {
  [key: number]: {
    [key: string]: string
  }
} = {
  [SEPOLIA]: {
    [CONTRACT_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [CONTRACT_KEYS.BRIDGE]: '0xc644cc19d2A9388b71dd1dEde07cFFC73237Dca8',
    [CONTRACT_KEYS.USDC]: '0x7f11f79DEA8CE904ed0249a23930f2e59b43a385',
  },
  [MODE_TESTNET]: {
    [CONTRACT_KEYS.MULTICALL]: '0xBAba8373113Fb7a68f195deF18732e01aF8eDfCF',
    [CONTRACT_KEYS.USDC]: '0xCeE87A6A681A28E5927F83EC2014ec6D7fe31163',
    [CONTRACT_KEYS.LIQUIDITY_VAULT]: '0x944c7626b5074F423F4C00aa54b520c4d985578d',
    [CONTRACT_KEYS.PERPS_VAULT]: '0x262172D64922C9Dda2fd22aADE46B60A2A18BA71',

    [CONTRACT_KEYS.PERPS_MARKET]: '0xF7550f0C091477e24E31b39bCE2333CFFbaBA663',
  },
  [MODE_MAINNET]: {
    [CONTRACT_KEYS.MULTICALL]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [CONTRACT_KEYS.USDC]: '0xd988097fb8612cc24eeC14542bC03424c656005f',
    [CONTRACT_KEYS.LIQUIDITY_VAULT]: '0x1Dc6c634AA3CDc6adeDE51167c9c2a46d206e792',
    [CONTRACT_KEYS.PERPS_VAULT]: '0x90210E15Ae164a304128c68F0f878FE5ca09b44c',
    [CONTRACT_KEYS.PERPS_MARKET]: '0x4EA71d198B05A208326F681730203dbFFB8Ee255',
    // [CONTRACT_KEYS.PERPS_MARKET]: '0x8DA098F5eA19050FC058c70bcE078eea9fC4e43D',
  },
}

export function isAddress(value: any): string {
  try {
    return getAddress(value)
  } catch {
    return ''
  }
}

// account is not optional
export function getSigner(provider: Web3Provider, account: string): Signer {
  return provider.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(provider: Web3Provider, account?: string | null): Provider | Signer {
  return account ? getSigner(provider, account) : provider
}

// account is optional
export function getContract(contract: ContractInfo, signer: Signer | Provider): Contract {
  const { address, abi } = contract
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, abi, signer)
}

export const getMulticallContract = (chainId: number, provider: Signer | Provider) => {
  return getContract({ address: CONTRACT_ADDRESSES[chainId]['MULTICALL'], abi: MULTICALL_ABI }, provider)
}

export const getResultFromReceipt = (receipt: TransactionReceipt, contract: Contract): Result | null => {
  const log = receipt.logs.find((e) => e.address === contract.address && e.transactionHash === receipt.transactionHash)
  if (!log) return null

  const data = contract.interface.parseLog(log)
  if (!data?.args.length) return null
  return data.args
}

export const BLOCK_WAITING_SECONDS: {
  [key: number]: number
} = {
  [MODE_TESTNET]: 12,
}

export const getDelayTime = (chainId: number) => {
  return (BLOCK_WAITING_SECONDS[chainId] ?? 6) * 1000
}
