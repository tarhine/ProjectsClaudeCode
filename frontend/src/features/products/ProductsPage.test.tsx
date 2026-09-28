import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProductsPage } from './ProductsPage'
import { productsApi } from './api'
import type { Product } from './types'

vi.mock('./api', () => ({
  productsApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

const mockedApi = vi.mocked(productsApi)

const sampleProduct: Product = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'Clavier mécanique',
  description: 'Switches rouges',
  price: 89.9,
  stockQuantity: 12,
  createdAtUtc: '2026-01-01T00:00:00Z',
  updatedAtUtc: null,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ProductsPage', () => {
  it('affiche la liste des produits chargés depuis l\'API', async () => {
    mockedApi.list.mockResolvedValue([sampleProduct])

    render(<ProductsPage />)

    expect(await screen.findByText('Clavier mécanique')).toBeInTheDocument()
    expect(screen.getByText('Switches rouges')).toBeInTheDocument()
  })

  it('affiche un message quand la liste est vide', async () => {
    mockedApi.list.mockResolvedValue([])

    render(<ProductsPage />)

    expect(await screen.findByText('Aucun produit pour le moment.')).toBeInTheDocument()
  })

  it('crée un produit via le formulaire du dialog', async () => {
    const user = userEvent.setup()
    mockedApi.list.mockResolvedValue([])
    mockedApi.create.mockResolvedValue(sampleProduct)

    render(<ProductsPage />)
    await screen.findByText('Aucun produit pour le moment.')

    await user.click(screen.getByRole('button', { name: 'Créer' }))
    const dialog = (await screen.findByText('Créer un produit')).closest(
      '[data-slot="dialog-content"]'
    ) as HTMLElement

    await user.type(within(dialog).getByLabelText('Nom'), 'Souris sans fil')
    await user.clear(within(dialog).getByLabelText('Prix'))
    await user.type(within(dialog).getByLabelText('Prix'), '29.99')

    await user.click(within(dialog).getByRole('button', { name: 'Créer' }))

    await waitFor(() => {
      expect(mockedApi.create).toHaveBeenCalledWith({
        name: 'Souris sans fil',
        description: null,
        price: 29.99,
        stockQuantity: 0,
      })
    })
  })

  it('supprime un produit après confirmation', async () => {
    const user = userEvent.setup()
    mockedApi.list.mockResolvedValue([sampleProduct])
    mockedApi.remove.mockResolvedValue(undefined)

    render(<ProductsPage />)
    await screen.findByText('Clavier mécanique')

    await user.click(screen.getByRole('button', { name: 'Supprimer Clavier mécanique' }))

    const dialog = await screen.findByText('Supprimer le produit ?')
    const dialogContainer = dialog.closest('[data-slot="alert-dialog-content"]') as HTMLElement
    await user.click(within(dialogContainer).getByRole('button', { name: 'Supprimer' }))

    await waitFor(() => {
      expect(mockedApi.remove).toHaveBeenCalledWith(sampleProduct.id)
    })
  })
})
