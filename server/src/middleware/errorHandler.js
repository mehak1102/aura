export function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || err.status || 500
  const message = err.message || 'Internal server error'

  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }

  res.status(status).json({
    success: false,
    message,
    ...(err.code && { code: err.code }),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}
