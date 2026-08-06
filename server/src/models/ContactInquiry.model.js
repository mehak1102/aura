import mongoose from 'mongoose'

const contactInquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
    },
    subject: { type: String, required: true, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ['new', 'read', 'archived'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true },
)

contactInquirySchema.methods.toAdminJSON = function toAdminJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    subject: this.subject,
    message: this.message,
    status: this.status,
    createdAt: this.createdAt?.toISOString?.() || this.createdAt,
  }
}

export const ContactInquiry =
  mongoose.models.ContactInquiry ||
  mongoose.model('ContactInquiry', contactInquirySchema)
