import { XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart as RechartsAreaChart, Area } from 'recharts'
import styled, { useTheme } from 'styled-components'
import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { commify } from '@ethersproject/units'
import { TokenPriceMetric } from '../../../constants/featured-campaigns/metrics'
import { ChartDataPoint } from '../../../constants/featured-campaigns/platforms'
import { Box, Flex } from 'rebass'
import Loader from 'react-spinners/BarLoader'

const ChartContainer = styled.div`
  height: 300px;
`

interface AreaChartProps {
  metric: TokenPriceMetric
}

export const AreaChart = ({ metric }: AreaChartProps) => {
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    let cancelled = false
    const fetchChartData = async () => {
      if (!cancelled) setLoading(true)
      try {
        const data = await metric.chartData()
        if (!cancelled) setChartData(data.sort((a, b) => a.x - b.x))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchChartData()
    return () => {
      cancelled = false
    }
  }, [metric])

  return (
    <ChartContainer>
      {loading ? (
        <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
          <Box>
            <Loader color={theme.accent} loading />
          </Box>
        </Flex>
      ) : chartData.length === 0 ? (
        <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
          <Box>No data</Box>
        </Flex>
      ) : (
        <ResponsiveContainer>
          <RechartsAreaChart data={chartData}>
            <defs>
              <linearGradient id="custom-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.accentStart} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme.surface} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              minTickGap={80}
              tickFormatter={(tick) => DateTime.fromMillis(tick).toFormat('DD')}
              dataKey="x"
              tick={{ fill: theme.surfaceContent }}
              type="number"
              domain={['dataMin', 'dataMax']}
            />
            <YAxis type="number" axisLine={false} interval="preserveEnd" tick={false} />
            <Tooltip
              cursor={{ fill: theme.border }}
              formatter={(val: string | number | (string | number)[]) =>
                val instanceof Array ? '' : `$${commify(val)}`
              }
              labelFormatter={(label: string | number) =>
                DateTime.fromMillis(parseInt(label.toString())).toLocaleString(DateTime.DATETIME_MED)
              }
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '8px 12px',
                borderRadius: 8,
                borderColor: theme.border,
                color: 'black',
              }}
            />
            <Area type="monotone" dataKey="y" fill="url(#custom-gradient)" stroke={theme.accent} />
          </RechartsAreaChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  )
}
