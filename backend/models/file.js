import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    filename: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 255
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255
    },
    mimetype: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    size: { 
      type: Number, 
      required: true,
      min: 0
    },
    data: { 
      type: Buffer, 
      required: true 
    },
    encoding: {
      type: String,
      maxlength: 50
    },
    url: {
      type: String,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    category: {
      type: String,
      enum: ['profile-picture', 'work-gallery', 'document', 'attachment', 'other'],
      default: 'other'
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    metadata: {
      type: Map,
      of: String
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
fileSchema.index({ owner: 1 });
fileSchema.index({ category: 1 });
fileSchema.index({ mimetype: 1 });
fileSchema.index({ isPublic: 1 });
fileSchema.index({ createdAt: -1 });

// Virtual for file size display
fileSchema.virtual('sizeDisplay').get(function() {
  const size = this.size;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
});

// Virtual for file type category
fileSchema.virtual('typeCategory').get(function() {
  if (this.mimetype.startsWith('image/')) return 'image';
  if (this.mimetype.startsWith('video/')) return 'video';
  if (this.mimetype.startsWith('audio/')) return 'audio';
  if (this.mimetype.includes('pdf')) return 'pdf';
  if (this.mimetype.includes('word')) return 'document';
  if (this.mimetype.includes('excel') || this.mimetype.includes('spreadsheet')) return 'spreadsheet';
  return 'other';
});

export default mongoose.model("File", fileSchema);