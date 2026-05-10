export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'https://irongate.dotair.stg.agidp.ir'

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/bff/backoffice/identity-service/v1/Users/LoginByPassword`,
  flightSchedules: `${API_BASE_URL}/bff/backoffice/flightflow-service/v1/Flights/Schedules/Paginated`,
}
