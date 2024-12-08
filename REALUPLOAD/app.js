const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use('/uploads',express.static('uploads'));
app.set('views engine','ejs')
// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Unique file name
  },
});

// Multer Upload Instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200* 1024 * 1024, // Max file size: 5MB
  },
  fileFilter: (req, file, cb) => {
    // Allow any file type
    cb(null, true);
  },
});

/* Serve static HTML form for testing
app.get('/', (req, res) => {
  res.send(`
    <h1>File Upload</h1>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
  `);
});
*/
// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
   // res.status(200).send(`File uploaded successfully: ${req.file.filename}`);
    res.render('index.ejs');
  } catch (err) {
    res.status(500).send(`Error uploading file: ${err.message}`);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).send(`Multer Error: ${err.message}`);
  } else {
    res.status(500).send(`Server Error: ${err.message}`);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
