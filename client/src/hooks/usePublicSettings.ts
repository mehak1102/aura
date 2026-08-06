import { useQuery } from '@tanstack/react-query'
import { settingsApi } from '@services/api/settings'
import { DEFAULT_FREE_SHIPPING_THRESHOLD } from '@utils/orders'

export function usePublicSettings() {
  return useQuery({
    queryKey: ['settings', 'public'],
    queryFn: () => settingsApi.public(),
    staleTime: 5 * 60_000,
  })
}

export function useFreeShippingThreshold() {
  const { data } = usePublicSettings()
  return data?.freeShippingThreshold ?? DEFAULT_FREE_SHIPPING_THRESHOLD
}
