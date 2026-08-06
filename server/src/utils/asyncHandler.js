export class AppError extends Error {
  constructor(message, statusCode = 400, extras = {}) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    if (extras.code) this.code = extras.code
  }
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
