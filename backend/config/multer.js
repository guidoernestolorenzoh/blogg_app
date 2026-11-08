const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../uploads"),
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + file.originalname)
    },
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imagenes'), false);
    }    
  }
module.exports = { storage, fileFilter };