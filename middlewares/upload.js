const multer = require('multer')
const path = require('path')

const tempDir = path.join(__dirname,"../", "tmp")

const storage = multer.diskStorage({
  destination: tempDir
});

const upload = multer({ storage });

module.exports = upload