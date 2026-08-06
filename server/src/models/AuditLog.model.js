import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema(
  {
    actorId: { type: String, required: true, index: true },
    actorEmail: { type: String },
    action: { type: String, required: true, index: true },
    targetType: { type: String },
    targetId: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
)

export const AuditLog =
  mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema)

export async function writeAuditLog(entry) {
  try {
    await AuditLog.create(entry)
  } catch (err) {
    console.error('[audit]', err.message)
  }
}
