import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { connectDB, isDbReady, getDatabaseMode } from './config/db.js'
import { env } from './config/env.js'
import { assertProductionSecrets } from './utils/secrets.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import routes from './routes/index.js'
import { memoryAuth } from './services/memoryAuth.js'
import { warmInstagramCache } from './services/instagram.service.js'

assertProductionSecrets()

const app = express()

app.set('trust proxy', 1)

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)
app.use(
  cors({
    origin: env.clientOrigins,
    credentials: true,
  }),
)
app.use(compression())
app.use(morgan(env.isProd ? 'combined' : 'dev'))
app.use(cookieParser())

// JSON for all routes except Razorpay webhook (needs raw bytes for HMAC).
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/payments/webhook')) {
    return express.raw({ type: 'application/json' })(req, res, next)
  }
  return express.json({ limit: '10mb' })(req, res, next)
})
app.use(express.urlencoded({ extended: true }))

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  })
})

app.get('/api/health/details', (_req, res) => {
  if (env.isProd) {
    res.status(401).json({ success: false, message: 'Unauthorized' })
    return
  }
  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'aura-of-nature-api',
      database: getDatabaseMode(),
      mongoReady: isDbReady(),
      timestamp: new Date().toISOString(),
    },
  })
})

app.use('/api', routes)
app.use(notFound)
app.use(errorHandler)

async function start() {
  await connectDB()

  if (env.isProd && !isDbReady()) {
    throw new Error('MongoDB is required in production')
  }

  if (!isDbReady() && !env.isProd) {
    await memoryAuth.ensureDevAdmin({
      email: 'admin@auraofnature.com',
      password: 'Admin1234!',
      name: 'Aura Admin',
    })
  }

  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`)
    console.log(`Database mode: ${getDatabaseMode()}`)
    console.log(`Storefront URL (emails): ${env.clientUrl}`)
    if (
      env.smtp.host &&
      /localhost|127\.0\.0\.1/i.test(env.clientUrl)
    ) {
      console.warn(
        'CLIENT_URL is localhost but SMTP is configured — password-reset emails will contain localhost links. Set CLIENT_URL to your live storefront.',
      )
    }
    warmInstagramCache()
  })
}

start().catch((err) => {
  console.error('Failed to start server', err)
  process.exit(1)
})
