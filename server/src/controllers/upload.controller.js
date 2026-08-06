import multer from 'multer'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { getCloudinary } from '../config/cloudinary.js'
import { cloudinaryConfigured } from '../utils/secrets.js'
import { MediaAsset } from '../models/MediaAsset.model.js'
import { isDbReady } from '../config/db.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      cb(new AppError('Only image uploads are allowed', 400))
      return
    }
    cb(null, true)
  },
})

export const uploadMiddleware = upload.single('file')

export const uploadImage = asyncHandler(async (req, res) => {
  if (!cloudinaryConfigured()) {
    throw new AppError('Image uploads are not configured (Cloudinary)', 503)
  }
  if (!req.file) throw new AppError('No file uploaded', 400)

  const cloudinary = getCloudinary()
  const folder = req.body.folder || 'aura-of-nature'
  const alt = req.body.alt || req.file.originalname || ''

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (err, uploaded) => {
        if (err) reject(err)
        else resolve(uploaded)
      },
    )
    stream.end(req.file.buffer)
  })

  let asset = null
  if (isDbReady()) {
    asset = await MediaAsset.create({
      url: result.secure_url,
      publicId: result.public_id,
      alt,
      folder,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      format: result.format,
    })
  }

  res.status(201).json({
    success: true,
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      alt,
      id: asset?._id?.toString(),
    },
  })
})

export const deleteImage = asyncHandler(async (req, res) => {
  if (!cloudinaryConfigured()) {
    throw new AppError('Image uploads are not configured (Cloudinary)', 503)
  }
  const { publicId, id } = req.body
  if (!publicId && !id) throw new AppError('publicId or id is required')

  let resolvedPublicId = publicId
  if (!resolvedPublicId && id && isDbReady()) {
    const asset = await MediaAsset.findById(id)
    resolvedPublicId = asset?.publicId
  }

  if (resolvedPublicId) {
    const cloudinary = getCloudinary()
    await cloudinary.uploader.destroy(resolvedPublicId)
  }

  if (isDbReady()) {
    if (id) await MediaAsset.findByIdAndDelete(id)
    else if (resolvedPublicId) {
      await MediaAsset.deleteOne({ publicId: resolvedPublicId })
    }
  }

  res.json({ success: true, message: 'Image deleted' })
})
