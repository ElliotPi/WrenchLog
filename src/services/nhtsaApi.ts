import type { DecodedVinResult, NhtsaDecodeResponse } from '../types/api'

const API_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues'

function normalizeVin(vin: string) {
  return vin.trim().toUpperCase()
}

export async function decodeVin(vin: string): Promise<DecodedVinResult> {
  const normalizedVin = normalizeVin(vin)

  if (normalizedVin.length < 11) {
    throw new Error('Enter a longer VIN before decoding.')
  }

  const response = await fetch(`${API_BASE}/${normalizedVin}?format=json`)

  if (!response.ok) {
    throw new Error('The VIN service is unavailable right now.')
  }

  const payload = (await response.json()) as NhtsaDecodeResponse
  const firstResult = payload.Results[0]

  if (!firstResult || !firstResult.Make || !firstResult.Model || !firstResult.ModelYear) {
    throw new Error('No usable decode result was returned for that VIN.')
  }

  return {
    vin: normalizedVin,
    year: firstResult.ModelYear,
    make: firstResult.Make,
    model: firstResult.Model,
    trim: firstResult.Trim || firstResult.Series || '',
  }
}
