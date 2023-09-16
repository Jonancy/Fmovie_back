const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/assets/'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set the filename for uploaded files
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
