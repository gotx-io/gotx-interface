import { NETWORK } from 'utils/config/constants'
import { Chain, NativeCurrency } from 'utils/web3/types'

export const SEPOLIA = 11155111
export const MODE_MAINNET = 34443
export const MODE_TESTNET = 919
export const DEFAULT_CHAIN_ID = NETWORK === 'mainnet' ? MODE_MAINNET : MODE_TESTNET
export const FAUCET_CHAIN_ID = SEPOLIA

export const SUPPORTED_CHAIN_IDS: number[] = NETWORK === 'mainnet' ? [MODE_MAINNET] : [SEPOLIA, MODE_TESTNET]

const NATIVE_CURRENCIES: { [key: string]: NativeCurrency } = {
  ETH: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
}

const SECONDARY_TOKENS: {
  [key: number]: {
    address: string
    icon?: string
  }[]
} = {
  [SEPOLIA]: [
    {
      address: '0x7f11f79DEA8CE904ed0249a23930f2e59b43a385',
    },
  ],
  [MODE_TESTNET]: [
    {
      address: '0xCeE87A6A681A28E5927F83EC2014ec6D7fe31163',
    },
  ],
  [MODE_MAINNET]: [
    {
      address: '0xd988097fb8612cc24eeC14542bC03424c656005f',
    },
  ],
}

const CHAINS: { [key: number]: Chain } = {
  [SEPOLIA]: {
    id: `0x${SEPOLIA.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Sepolia',
    icon: 'ETH',
    rpcUrl: 'https://ethereum-sepolia.publicnode.com',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    secondaryTokens: SECONDARY_TOKENS[SEPOLIA],
  },
  [MODE_TESTNET]: {
    id: `0x${MODE_TESTNET.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Mode Tesnet',
    icon: 'MODE',
    rpcUrl: 'https://sepolia.mode.network',
    blockExplorerUrl: 'https://sepolia.explorer.mode.network',
    secondaryTokens: SECONDARY_TOKENS[MODE_TESTNET],
  },
  [MODE_MAINNET]: {
    id: `0x${MODE_MAINNET.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Mode Mainnet',
    icon: 'MODE',
    rpcUrl: 'https://mainnet.mode.network/',
    blockExplorerUrl: 'https://explorer.mode.network',
    secondaryTokens: SECONDARY_TOKENS[MODE_MAINNET],
  },
}

const chains = SUPPORTED_CHAIN_IDS.map((id) => CHAINS[id])

const getChainMetadata = (chainId: number, rpcUrls?: string[]) => {
  const chain = CHAINS[chainId] ?? {
    id: `0x${chainId.toString(16)}`,
  }
  if (rpcUrls) return { ...chain, rpcUrls }
  return chain
}

export { NATIVE_CURRENCIES, CHAINS, chains, getChainMetadata }
