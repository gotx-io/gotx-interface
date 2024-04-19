import { BigNumber } from '@ethersproject/bignumber'
import { memo } from 'react'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import Num from 'entities/Num'
import { useAuthContext } from 'hooks/web3/useAuth'
import { useERC20Contract } from 'hooks/web3/useContract'
import useContractQuery from 'hooks/web3/useContractQuery'
import { CONTRACT_KEYS } from 'utils/config/keys'
import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'
import { CONTRACT_ADDRESSES } from 'utils/web3/contracts'

interface BalancesState {
  balances: { [key: string]: Num | null }
  setBalance: (balance: { [key: string]: Num | null }) => void
  setBalances: (balance: { [key: string]: Num | null }) => void
}

const useBalancesStore = create<BalancesState>()(
  immer((set) => ({
    balances: {},
    setBalance: (balance) =>
      set((state) => {
        state.balances = { ...state.balances, ...balance }
      }),
    setBalances: (balance) =>
      set((state) => {
        state.balances = balance
      }),
  }))
)
export default useBalancesStore

export const InitBalancesStore = memo(function InitModeBalanceStore() {
  const setBalance = useBalancesStore((state) => state.setBalance)
  const { account } = useAuthContext()
  const USDCContract = useERC20Contract(CONTRACT_ADDRESSES[DEFAULT_CHAIN_ID][CONTRACT_KEYS.USDC], false)
  const BLIContract = useERC20Contract(CONTRACT_ADDRESSES[DEFAULT_CHAIN_ID][CONTRACT_KEYS.LIQUIDITY_VAULT], false)
  useContractQuery<BigNumber>(USDCContract, 'balanceOf', [account?.address], {
    refetchInterval: 5000,
    onSuccess(data) {
      setBalance({ USDC: new Num(data, 6) })
    },
  })
  useContractQuery<BigNumber>(BLIContract, 'balanceOf', [account?.address], {
    refetchInterval: 5000,
    onSuccess(data) {
      setBalance({ GLI: new Num(data) })
    },
  })
  return null
})
