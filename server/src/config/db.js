import mongoose from 'mongoose'
import { env } from './env.js'

let dbConnected = false
let wasConnected = false

mongoose.connection.on('connected', () => {
  dbConnected = true
  wasConnected = true
})

mongoose.connection.on('disconnected', () => {
  dbConnected = false
  if (wasConnected && !env.isProd) {
    console.warn(
      'MongoDB disconnected — auth/data will use in-memory fallback until reconnected.',
    )
  }
})

export async function connectDB() {
  mongoose.set('strictQuery', true)

  try {
    await mongoose.connect(env.mongoUri)
    dbConnected = true
    console.log(`MongoDB connected (${mongoose.connection.name})`)
  } catch (error) {
    dbConnected = false
    console.error('MongoDB connection failed:', error.message)
    if (env.isProd) {
      throw error
    }
    console.warn(
      'Auth and data routes will use in-memory fallback until MongoDB is available.',
    )
  }
}

/** Retry connect when the pool dropped but the API process is still running */
export async function ensureDbConnection() {
  if (dbConnected && mongoose.connection.readyState === 1) {
    return true
  }

  if (mongoose.connection.readyState === 2) {
    return false
  }

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(env.mongoUri)
    } else {
      await mongoose.connection.asPromise()
    }
    dbConnected = mongoose.connection.readyState === 1
    if (dbConnected) {
      console.log(`MongoDB reconnected (${mongoose.connection.name})`)
    }
    return dbConnected
  } catch (error) {
    dbConnected = false
    return false
  }
}

export function isDbReady() {
  return dbConnected && mongoose.connection.readyState === 1
}

export function getDatabaseMode() {
  if (isDbReady()) return 'mongodb'
  if (!env.isProd) return 'memory-fallback'
  return 'unavailable'
}
