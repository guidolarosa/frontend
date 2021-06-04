import { Box, Flex, Text } from 'rebass'
import { Duration } from 'luxon'
import { ButtonMedium } from '../button'
import { useTheme } from 'styled-components'
import { useEffect, useState } from 'react'
import { useInterval } from 'react-use'
import { TokenAmount } from 'carrot-sdk'
import { useTokenPriceUSD } from '../../hooks/useTokenPriceUSD'
import Skeleton from 'react-loading-skeleton'
import { Card } from '../card'

interface CampaignCardProps {
  loading?: boolean
  kpiId?: string
  creator?: string
  duration?: Duration
  goal?: string
  collateral?: TokenAmount
  onClick?: () => void
}

export function CampaignCard({ loading, kpiId, creator, duration, goal, collateral, onClick }: CampaignCardProps) {
  const theme = useTheme()
  const { priceUSD: collateralPriceUSD } = useTokenPriceUSD(collateral?.token)

  const [countdownDuration, setCountdownDuration] = useState(duration)
  const [countdownText, setCountdownText] = useState('')

  useInterval(() => {
    if (!countdownDuration) return
    setCountdownDuration(countdownDuration.minus(1000))
  }, 1000)

  useEffect(() => {
    if (!countdownDuration) return
    const rawText = countdownDuration.toFormat('dd/hh/mm/ss')
    const splitRawText = rawText.split('/')
    setCountdownText(`${splitRawText[0]}D ${splitRawText[1]}H ${splitRawText[2]}M ${splitRawText[3]}S`)
  }, [countdownDuration])

  return (
    <Card p="24px 32px" flexDirection="column" maxWidth="300px">
      <Flex width="100%" justifyContent="space-between" mb="16px">
        <Text fontSize="20px" fontWeight="700" lineHeight="30px" color={theme.primary}>
          {loading ? <Skeleton width="40px" /> : creator}
        </Text>
      </Flex>
      <Flex mb="20px">
        <Text fontSize="20px" fontWeight="800" lineHeight="20px">
          {loading ? <Skeleton width="160px" /> : goal}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="4px">
        <Text>Rewards:</Text>
        <Text textAlign="center" fontSize="20px" fontWeight="800" color={theme.primary}>
          ${loading || !collateral ? <Skeleton width="60px" /> : collateral.multiply(collateralPriceUSD).toFixed(2)}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Text>Time left:</Text>
        <Text fontSize="12px" fontWeight="600">
          {loading ? <Skeleton width="80px" /> : countdownText}
        </Text>
      </Flex>
      <Box>
        <ButtonMedium onClick={onClick} width="100%">
          See campaign
        </ButtonMedium>
      </Box>
    </Card>
  )
}
