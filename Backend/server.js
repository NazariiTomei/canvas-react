const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file); // Log req.file to see if the file is being received
  if (req.file) {
    res.json({ 
      message: 'File uploaded successfully', 
      fileName: req.file.filename, 
      filePath: `http://localhost:5000/${req.file.filename}` 
    });
  } else {
    res.status(400).json({ message: 'File upload failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
