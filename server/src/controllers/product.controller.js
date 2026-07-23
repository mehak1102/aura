import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { productCatalog } from '../services/productCatalog.js'

export const listProducts = asyncHandler(async (req, res) => {
  const products = await productCatalog.list(req.query)
  res.json({
    success: true,
    data: { products, total: products.length },
  })
})

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productCatalog.getBySlug(req.params.slug)
  if (!product) throw new AppError('Product not found', 404)
  res.json({ success: true, data: { product } })
})

export const searchProducts = asyncHandler(async (req, res) => {
  const q = req.query.q || req.query.query
  const products = await productCatalog.list({ ...req.query, query: q })
  res.json({
    success: true,
    data: { products, total: products.length, query: q },
  })
})

export const getProductFilters = asyncHandler(async (_req, res) => {
  const products = await productCatalog.list()
  const meta = productCatalog.getFilterMeta(products)
  res.json({ success: true, data: meta })
})
