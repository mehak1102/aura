import multer from 'multer'
import { AppError, asyncHandler } from '../utils/asyncHandler.js'
import { getCloudinary } from '../config/cloudinary.js'
import { cloudinaryConfigured } from '../utils/secrets.js'

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

  res.status(201).json({
    success: true,
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    },
  })
})

export const deleteImage = asyncHandler(async (req, res) => {
  if (!cloudinaryConfigured()) {
    throw new AppError('Image uploads are not configured (Cloudinary)', 503)
  }
  const { publicId } = req.body
  if (!publicId) throw new AppError('publicId is required')

  const cloudinary = getCloudinary()
  await cloudinary.uploader.destroy(publicId)

  res.json({ success: true, message: 'Image deleted' })
})
