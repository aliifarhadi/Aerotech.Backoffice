import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import flightSchedulesReducer from '../features/flightSchedules/flightSchedulesSlice'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flightSchedules: flightSchedulesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
