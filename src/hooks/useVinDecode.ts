import { useState } from 'react'
import { decodeVin } from '../services/nhtsaApi'
import type { DecodedVinResult } from '../types/api'

export function useVinDecode() {
  const [data, setData] = useState<DecodedVinResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function runDecode(vin: string) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await decodeVin(vin)
      setData(result)
      return result
    } catch (decodeError) {
      const message = decodeError instanceof Error ? decodeError.message : 'Unable to decode VIN right now.'
      setError(message)
      setData(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    data,
    error,
    isLoading,
    runDecode,
  }
}
