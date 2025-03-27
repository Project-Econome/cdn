const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

exports.handler = (event, context) => {
  return new Promise((resolve, reject) => {
    upload.single('image')(event, context, (err) => {
      if (err) {
        return reject({ statusCode: 400, body: 'No file uploaded' });
      }
      const fileUrl = `/images/${event.file.filename}`;
      resolve({
        statusCode: 200,
        body: JSON.stringify({
          message: 'Image uploaded successfully!',
          url: fileUrl
        })
      });
    });
  });
};
