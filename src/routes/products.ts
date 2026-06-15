import { Router } from 'express'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController'
import { protect, adminOnly } from '../middleware/auth'

const router = Router()
router.get('/',           getProducts)
router.get('/:code',      getProduct)
router.post('/',          protect, adminOnly, createProduct)
router.put('/:id',        protect, adminOnly, updateProduct)
router.delete('/:id',     protect, adminOnly, deleteProduct)
export default router
