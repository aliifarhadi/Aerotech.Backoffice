import apiClient from '../api/axios'

export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = any

const LOGIN_URL = 'https://irongate.dotair.stg.agidp.ir/bff/backoffice/identity-service/v1/Users/LoginByPassword'

export const authService = {
  login: async (payload: LoginRequest) => {
    const res = await apiClient.post<LoginResponse>(LOGIN_URL, payload)
    const data = res.data as any

    // If API follows BaseResult and reports errors inside `errors` array, surface them
    if (data && Array.isArray(data.errors) && data.errors.length > 0) {
      const msg = data.errors.map((e: any) => e.detail || e.title || `code:${e.code}`).join('; ')
      const err: any = new Error(msg)
      err.apiResult = data
      throw err
    }

    return data
  },
}

export default authService
