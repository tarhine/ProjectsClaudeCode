import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Product, ProductFormValues } from './types'

const emptyValues: ProductFormValues = {
  name: '',
  description: '',
  price: '0',
  stockQuantity: '0',
}

function toFormValues(product: Product | null): ProductFormValues {
  if (!product) {
    return emptyValues
  }

  return {
    name: product.name,
    description: product.description ?? '',
    price: String(product.price),
    stockQuantity: String(product.stockQuantity),
  }
}

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  submitting: boolean
  onSubmit: (values: ProductFormValues) => Promise<void>
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  submitting,
  onSubmit,
}: ProductFormDialogProps) {
  const [values, setValues] = useState<ProductFormValues>(() => toFormValues(product))
  const [error, setError] = useState<string | null>(null)
  const isEditing = product !== null

  useEffect(() => {
    if (open) {
      setValues(toFormValues(product))
      setError(null)
    }
  }, [open, product])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!values.name.trim()) {
      setError('Le nom du produit est obligatoire.')
      return
    }

    const price = Number(values.price)
    const stockQuantity = Number(values.stockQuantity)

    if (Number.isNaN(price) || price < 0) {
      setError('Le prix doit être un nombre positif.')
      return
    }

    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      setError('La quantité en stock doit être un entier positif.')
      return
    }

    setError(null)
    await onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Modifier le produit' : 'Créer un produit'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Mettez à jour les informations du produit.'
                : 'Renseignez les informations du nouveau produit.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product-name">Nom</Label>
              <Input
                id="product-name"
                value={values.name}
                maxLength={200}
                onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                value={values.description}
                maxLength={2000}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="product-price">Prix</Label>
                <Input
                  id="product-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={values.price}
                  onChange={(event) => setValues((prev) => ({ ...prev, price: event.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="product-stock">Stock</Label>
                <Input
                  id="product-stock"
                  type="number"
                  min={0}
                  step="1"
                  value={values.stockQuantity}
                  onChange={(event) =>
                    setValues((prev) => ({ ...prev, stockQuantity: event.target.value }))
                  }
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
