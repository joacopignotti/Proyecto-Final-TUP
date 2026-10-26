import { request } from './apiClient'

export const getHealth = async () =>
  (await request<{ status: string; timestamp: string }>('/health')).data!
