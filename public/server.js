const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Directory to store uploaded images
const IMAGE_DIR = path.join(__dirname, 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR);
}

// Set up multer storage for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGE_DIR);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Route to upload an image
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const fileUrl = `/images/${req.file.filename}`;
  res.status(200).json({
    message: 'Image uploaded successfully!',
    url: fileUrl,
  });
});

// Route to get an image by filename
app.get('/images/:filename', (req, res) => {
  const filePath = path.join(IMAGE_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Image not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
