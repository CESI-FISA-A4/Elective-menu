const multer = require("multer");
var path = require('path');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', '..') + process.env.STORAGE_PATH,
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: process.env.FILE_SIZE_MAX
    }
});