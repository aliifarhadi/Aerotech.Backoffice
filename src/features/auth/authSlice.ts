import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import authService, { LoginRequest } from '../../services/authService'
import { setAuthToken } from '../../api/axios'

type AuthState = {
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('aero_token'),
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginRequest, { rejectWithValue }) => {
    try {
      const data = await authService.login(payload)
      return data
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Login failed'
      return rejectWithValue(message)
    }
  }
)

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      localStorage.removeItem('aero_token')
      setAuthToken(null)
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
      localStorage.setItem('aero_token', action.payload)
      setAuthToken(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        // adapt to API shape: prefer accessToken
        const token = (action.payload as any).accessToken || (action.payload as any).token
        if (token) {
          state.token = token
          localStorage.setItem('aero_token', token)
          setAuthToken(token)
        }
        state.loading = false
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, setToken } = slice.actions
export default slice.reducer
