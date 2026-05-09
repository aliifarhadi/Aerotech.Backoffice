import apiClient from '../api/axios'

export type FlightSchedule = {
  id?: string
  flightNumber?: string
  departure?: string
  arrival?: string
  departureTime?: string
  arrivalTime?: string
  status?: string
  // Allow additional fields
  [key: string]: any
}

export type PaginatedFlightSchedules = {
  data: FlightSchedule[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

const FLIGHT_SCHEDULES_URL = 'https://irongate.dotair.stg.agidp.ir/bff/backoffice/flightflow-service/v1/Flights/Schedules/Paginated'

const isArrayOfObjects = (value: any): value is any[] =>
  Array.isArray(value) && value.length > 0 && value.every((item) => item && typeof item === 'object' && !Array.isArray(item))

const findRows = (data: any): any[] => {
  if (!data) return []
  if (isArrayOfObjects(data)) return data

  const candidates = [
    data.data,
    data.items,
    data.result?.data,
    data.result?.items,
    data.payload?.data,
    data.payload?.items,
  ]

  for (const candidate of candidates) {
    if (isArrayOfObjects(candidate)) {
      return candidate
    }
  }

  if (typeof data === 'object') {
    for (const value of Object.values(data)) {
      if (isArrayOfObjects(value)) {
        return value
      }
      if (typeof value === 'object' && value != null) {
        for (const nestedValue of Object.values(value)) {
          if (isArrayOfObjects(nestedValue)) {
            return nestedValue
          }
        }
      }
    }
  }

  return []
}

const readCount = (data: any, rows: any[]) => {
  if (typeof data?.total === 'number') return data.total
  if (typeof data?.totalCount === 'number') return data.totalCount
  if (typeof data?.count === 'number') return data.count
  if (typeof data?.result?.total === 'number') return data.result.total
  if (typeof data?.result?.totalCount === 'number') return data.result.totalCount
  return rows.length
}

export const flightService = {
  getFlightSchedules: async (page: number = 1, pageSize: number = 10) => {
    const res = await apiClient.get(FLIGHT_SCHEDULES_URL, {
      params: { page, pageSize }
    })
    const data = res.data as any

    // Handle errors similar to authService
    if (data && Array.isArray(data.errors) && data.errors.length > 0) {
      const msg = data.errors.map((e: any) => e.detail || e.title || `code:${e.code}`).join('; ')
      const err: any = new Error(msg)
      err.apiResult = data
      throw err
    }

    const rows = findRows(data)
    const total = readCount(data, rows)
    const normalizedData: PaginatedFlightSchedules = {
      data: rows,
      total,
      page: data.page || page,
      pageSize: data.pageSize || pageSize,
      totalPages: data.totalPages || Math.ceil(total / (data.pageSize || pageSize)),
    }

    return normalizedData
  },
}

export default flightService