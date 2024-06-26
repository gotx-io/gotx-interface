import { Trans } from '@lingui/macro'
import { ReactNode, useState } from 'react'

import useGlobalCount from 'hooks/store/useGlobalCount'
import { Button } from 'theme/Buttons'
import { Box, Flex, Type } from 'theme/base'

import OpenPositions from './OpenPositions'
import OrderHistory from './OrderHistory'
import PendingOrders from './PendingOrders'
import PositionHistory from './PositionHistory'

const TABS = [
  { label: <Trans>Open Positions</Trans>, value: 'open-positions' },
  { label: <Trans>Pending Orders</Trans>, value: 'pending-orders' },
  // { label: <Trans>Open Orders</Trans>, value: 'open-orders' },
  { label: <Trans>Orders History</Trans>, value: 'orders-history' },
  // { label: <Trans>Trades History</Trans>, value: 'trades-history' },
  { label: <Trans>Positions History</Trans>, value: 'positions-history' },
]
const DEFAULT_TAB = TABS[0]
type TabOption = typeof DEFAULT_TAB
export default function PositionManagement({ isValid, alert }: { isValid: boolean; alert: ReactNode }) {
  const [currentTab, setTab] = useState(DEFAULT_TAB)
  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%' }}>
      <Box sx={{ height: 48, position: 'relative' }}>
        <Tabs currentTab={currentTab} onChangeTab={(_option) => setTab(_option)} />
      </Box>

      <Box flex="1 0 0" sx={{ bg: 'background2', borderTop: 'small', borderTopColor: 'stroke', mt: '-1px' }}>
        {isValid ? (
          <Box display={currentTab.value === 'open-positions' ? 'block' : 'none'} height="100%">
            <OpenPositions />
          </Box>
        ) : (
          alert
        )}
        {isValid ? (
          <Box display={currentTab.value === 'pending-orders' ? 'block' : 'none'} height="100%">
            <PendingOrders />
          </Box>
        ) : (
          alert
        )}
        {currentTab.value === 'positions-history' && <PositionHistory />}
        {currentTab.value === 'orders-history' && <OrderHistory />}
      </Box>
    </Flex>
  )
}

function Tabs({ currentTab, onChangeTab }: { currentTab: TabOption; onChangeTab: (option: TabOption) => void }) {
  const { openingPositionsCount, pendingOrdersCount } = useGlobalCount()
  return (
    <Flex mb={3} sx={{ height: '100%', gap: 24 }}>
      {TABS.map((tab) => {
        const isActive = currentTab.value === tab.value
        return (
          <Button
            variant="ghost"
            key={tab.value}
            onClick={() => onChangeTab(tab)}
            sx={{
              height: '100%',
              borderRadius: 0,
              fontWeight: 'normal',
              ...(isActive
                ? { color: 'neutral1', borderBottom: 'small', borderBottomColor: 'neutral1' }
                : { color: 'neutral5' }),
            }}
          >
            <Flex alignItems="center" sx={{ gap: 2 }}>
              {tab.label}
              {tab.value === 'open-positions' && openingPositionsCount > 0 && (
                <Box bg="primary1" px="5px" py="0px" sx={{ borderRadius: '2px' }} color="neutral8">
                  <Type.Small lineHeight="12px">{openingPositionsCount}</Type.Small>
                </Box>
              )}
              {tab.value === 'pending-orders' && pendingOrdersCount > 0 && (
                <Box bg="primary1" px="5px" py="0px" sx={{ borderRadius: '2px' }} color="neutral8">
                  <Type.Small lineHeight="12px">{pendingOrdersCount}</Type.Small>
                </Box>
              )}
            </Flex>
          </Button>
        )
      })}
    </Flex>
  )
}
