import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { productsApi } from './features/products/api'

vi.mock('./features/products/api', () => ({
  productsApi: {
    list: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('App', () => {
  it('affiche le titre principal', () => {
    render(<App />)

    expect(screen.getByText('Produits')).toBeInTheDocument()
  })

  it('charge la liste des produits et affiche le bouton de création', async () => {
    render(<App />)

    expect(productsApi.list).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Créer' })).toBeInTheDocument()
  })
})
