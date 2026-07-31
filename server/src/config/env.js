export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aura-of-nature',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  isProd: process.env.NODE_ENV === 'production',
  clientOrigins: (process.env.CLIENT_ORIGINS || 'http://localhost:5173,http://localhost:5174')
    .split(',')
    .map((s) => s.trim()),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Aura of Nature <noreply@auraofnature.local>',
  },
  instagram: {
    username: process.env.INSTAGRAM_USERNAME || 'auraofnatureofficial',
    // Optional — never required for the feed to work
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
    userId: process.env.INSTAGRAM_USER_ID || '',
  },
}
