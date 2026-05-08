import apiClient from '../api/axios'

export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
  // adapt fields based on actual API response
}

const LOGIN_URL = 'https://irongate.dotair.stg.agidp.ir/bff/backoffice/identity-service/v1/Users/LoginByPassword'

export const authService = {
  login: async (payload: LoginRequest) => {
    const res = await apiClient.post<LoginResponse>(LOGIN_URL, payload)
    return res.data
  },
}

export default authService
