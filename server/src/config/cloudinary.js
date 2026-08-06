import { v2 as cloudinary } from 'cloudinary'
import { env } from './env.js'
import { cloudinaryConfigured } from '../utils/secrets.js'

let configured = false

export function getCloudinary() {
  if (!cloudinaryConfigured()) return null
  if (!configured) {
    cloudinary.config({
      cloud_name: env.cloudinary.cloudName,
      api_key: env.cloudinary.apiKey,
      api_secret: env.cloudinary.apiSecret,
      secure: true,
    })
    configured = true
  }
  return cloudinary
}
