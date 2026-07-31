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
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import routes from './routes/index.js'
import { memoryAuth } from './services/memoryAuth.js'
import { warmInstagramCache } from './services/instagram.service.js'

const app = express()

app.set('trust proxy', 1)

// cross-origin so the static client (separate Render service) can load /api/instagram/image
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
app.use(express.json({ limit: '10mb' }))
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

// app.get('/api/health', (_req, res) => {
//   res.json({
//     success: true,
//     data: {
//       status: 'ok',
//       service: 'aura-of-nature-api',
//       database: getDatabaseMode(),
//       mongoReady: isDbReady(),
//       timestamp: new Date().toISOString(),
//     },
//   })
// })
app.get('/api/health', (_req, res) => {
  console.log("🔥 HEALTH ROUTE HIT");

  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'aura-of-nature-api',
    },
  });
});

app.use('/api', routes)
app.use(notFound)
app.use(errorHandler)

async function start() {
  await connectDB()

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
    warmInstagramCache()
  })
}

start().catch((err) => {
  console.error('Failed to start server', err)
  process.exit(1)
})
