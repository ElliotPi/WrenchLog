export interface DecodedVinResult {
  vin: string
  year: string
  make: string
  model: string
  trim?: string
}

export interface NhtsaDecodeItem {
  Make: string
  Model: string
  ModelYear: string
  Series: string
  Trim: string
}

export interface NhtsaDecodeResponse {
  Results: NhtsaDecodeItem[]
}
