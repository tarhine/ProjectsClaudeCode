import { apiClient } from '@/lib/api-client'
import type { Product } from './types'

export interface ProductPayload {
  name: string
  description: string | null
  price: number
  stockQuantity: number
}

export const productsApi = {
  list: () => apiClient.get<Product[]>('/products'),
  create: (payload: ProductPayload) => apiClient.post<Product>('/products', payload),
  update: (id: string, payload: ProductPayload) =>
    apiClient.put<void>(`/products/${id}`, { id, ...payload }),
  remove: (id: string) => apiClient.delete(`/products/${id}`),
}
