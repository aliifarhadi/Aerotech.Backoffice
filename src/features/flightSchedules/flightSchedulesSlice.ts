import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import flightService, { PaginatedFlightSchedules } from '../../services/flightService'

type FlightSchedulesState = {
  data: PaginatedFlightSchedules | null
  loading: boolean
  error: string | null
}

const initialState: FlightSchedulesState = {
  data: null,
  loading: false,
  error: null,
}

export const fetchFlightSchedules = createAsyncThunk(
  'flightSchedules/fetchFlightSchedules',
  async ({ page, pageSize }: { page: number; pageSize: number }, { rejectWithValue }) => {
    try {
      const data = await flightService.getFlightSchedules(page, pageSize)
      return data
    } catch (err: any) {
      const message = (err?.message) || err?.response?.data || 'Failed to fetch flight schedules'
      return rejectWithValue(message)
    }
  }
)

const slice = createSlice({
  name: 'flightSchedules',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlightSchedules.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFlightSchedules.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.data = action.payload
      })
      .addCase(fetchFlightSchedules.rejected, (state, action) => {
        state.loading = false
        state.error = typeof action.payload === 'string' ? action.payload : JSON.stringify(action.payload)
      })
  },
})

export default slice.reducer