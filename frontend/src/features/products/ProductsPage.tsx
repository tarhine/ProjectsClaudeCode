import { useCallback, useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ApiError } from '@/lib/api-client'
import { productsApi } from './api'
import { ProductFormDialog } from './ProductFormDialog'
import type { Product, ProductFormValues } from './types'

const currencyFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Une erreur inattendue s'est produite."
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const data = await productsApi.list()
      setProducts(data)
    } catch (error) {
      setLoadError(errorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

  const openCreateDialog = () => {
    setEditingProduct(null)
    setFormOpen(true)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormOpen(true)
  }

  const handleSubmit = async (values: ProductFormValues) => {
    setSubmitting(true)
    const payload = {
      name: values.name.trim(),
      description: values.description.trim() || null,
      price: Number(values.price),
      stockQuantity: Number(values.stockQuantity),
    }

    try {
      if (editingProduct) {
        await productsApi.update(editingProduct.id, payload)
        toast.success('Produit mis à jour.')
      } else {
        await productsApi.create(payload)
        toast.success('Produit créé.')
      }
      setFormOpen(false)
      await loadProducts()
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!productToDelete) {
      return
    }

    setDeleting(true)
    try {
      await productsApi.remove(productToDelete.id)
      toast.success('Produit supprimé.')
      setProductToDelete(null)
      await loadProducts()
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button onClick={openCreateDialog}>
          <Plus />
          Créer
        </Button>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Prix</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Chargement...
                </TableCell>
              </TableRow>
            )}

            {!loading && loadError && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-destructive">
                  {loadError}
                </TableCell>
              </TableRow>
            )}

            {!loading && !loadError && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucun produit pour le moment.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !loadError &&
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="max-w-64 truncate text-muted-foreground">
                    {product.description || '—'}
                  </TableCell>
                  <TableCell className="text-right">{currencyFormatter.format(product.price)}</TableCell>
                  <TableCell className="text-right">{product.stockQuantity}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Modifier ${product.name}`}
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Supprimer ${product.name}`}
                        onClick={() => setProductToDelete(product)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        submitting={submitting}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={productToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setProductToDelete(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. « {productToDelete?.name} » sera définitivement
              supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault()
                void handleDelete()
              }}
            >
              {deleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
