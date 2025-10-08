import express from "express";
import File from "../models/file.js";
import multer from "multer";
import verifyApiKey, { isApiKeyValid } from "../middleware/verify_api_key.js";
import verifyAccessToken, { resolveUserFromAccessToken } from "../middleware/authentication.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const applyFileResponseHeaders = (req, res, file) => {
  res.setHeader("Content-Disposition", `inline; filename="${file.filename}"`);
  res.setHeader("Content-Type", file.mimetype);

  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("cross-origin-resource-policy", "cross-origin");
};

const sendFileResponse = (req, res, file) => {
  applyFileResponseHeaders(req, res, file);
  return res.send(file.data);
};

// Add API key verification middleware to all routes except the public file endpoint and direct file access
router.use((req, res, next) => {
  // Skip API key verification for the public file endpoint and direct file access
  if (req.path.startsWith('/public/') || req.path.match(/^\/[^\/]+$/)) {
    return next();
  }
  // For other routes, verify API key
  verifyApiKey(req, res, next);
});

// Get public file by ID
router.get("/public/:id", async (req, res) => {
  const fileId = req.params.id;
  const apiKey = req.query.apiKey;
  
  // Verify API key for public file access
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ errors: [{ msg: 'Invalid API key' }] });
  }
  
  try {
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    sendFileResponse(req, res, file);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get file by ID (public access for public files, authenticated access for private files)
router.get("/:id", async (req, res) => {
  const fileId = req.params.id;
  try {
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.isPublic) {
      return sendFileResponse(req, res, file);
    }

    if (isApiKeyValid(req)) {
      return sendFileResponse(req, res, file);
    }

    const { user, reason } = await resolveUserFromAccessToken(req);

    if (user) {
      const ownsFile = user._id.toString() === file.owner.toString();
      const isAdmin = user.role === "admin";

      if (!ownsFile && !isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user;
      return sendFileResponse(req, res, file);
    }

    const message = reason === "missing"
      ? "Authentication required"
      : reason === "user-not-found"
        ? "User not found"
        : "Invalid or expired access token";

    return res.status(401).json({ errors: [{ msg: message }] });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update file (authenticated users)
router.put("/:id", verifyAccessToken, upload.single("file"), async (req, res) => {
  const fileId = req.params.id;
  const file = req.file;
  console.log(fileId, file);

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Get the existing file to preserve isPublic status
    const existingFile = await File.findById(fileId);
    
    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      {
        filename: file.originalname,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        data: file.buffer,
        isPublic: existingFile?.isPublic || false,
      },
      { new: true } // return the updated document
    );
    console.log(updatedFile);

    if (!updatedFile) {
      return res.status(404).json({ message: "File not found" });
    }

    // Update the URL
    updatedFile.url = `/api/files/${updatedFile._id}`;
    await updatedFile.save();

    return res
      .status(200)
      .json({ message: "File updated successfully", file: updatedFile });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Upload file (authenticated users)
router.post("/", verifyAccessToken, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const { category = 'other', isPublic = true } = req.body; // Default to public for portfolio images

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newFile = new File({
      filename: file.originalname,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      data: file.buffer,
      owner: req.user._id,
      category,
      isPublic,
    });

    await newFile.save();
    
    // Set the URL after the file is saved to get the ID
    newFile.url = `/api/files/${newFile._id}`;
    await newFile.save();

    return res.status(201).json({
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Delete file (authenticated users)
router.delete("/:id", verifyAccessToken, async (req, res) => {
  const fileId = req.params.id;
  try {
    const deletedFile = await File.findByIdAndDelete(fileId);
    if (!deletedFile) {
      return res.status(404).json({ message: "File not found" });
    }
    res
      .status(200)
      .json({ message: "File deleted successfully", file: deletedFile });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's files (authenticated users)
router.get("/user/:userId", verifyAccessToken, async (req, res) => {
  try {
    // Only allow users to get their own files or admins
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const { category, isPublic, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { owner: req.params.userId };
    if (category) query.category = category;
    if (isPublic !== undefined) query.isPublic = isPublic === 'true';
    
    const files = await File.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await File.countDocuments(query);
    
    res.status(200).json({
      files,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update file metadata (authenticated users)
router.patch("/:id", verifyAccessToken, async (req, res) => {
  try {
    const { filename, category, isPublic, metadata } = req.body;
    
    // Build update object
    const update = {};
    if (filename) update.filename = filename;
    if (category) update.category = category;
    if (isPublic !== undefined) update.isPublic = isPublic;
    if (metadata) update.metadata = metadata;
    
    const updatedFile = await File.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      update,
      { new: true }
    );
    
    if (!updatedFile) {
      return res.status(404).json({ message: "File not found or access denied" });
    }
    
    res.status(200).json({ 
      message: "File metadata updated successfully", 
      file: updatedFile 
    });
  } catch (error) {
    console.error("Error updating file metadata:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;