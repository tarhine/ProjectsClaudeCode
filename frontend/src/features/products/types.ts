export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stockQuantity: number
  createdAtUtc: string
  updatedAtUtc: string | null
}

export interface ProductFormValues {
  name: string
  description: string
  price: string
  stockQuantity: string
}
