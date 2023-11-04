const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/requests")
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop()
        const newName = Date.now() + "." + ext
        cb(null, newName)
    }
})



const upload = multer({
    storage,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/pdf" || file.mimetype == "application/docx" || file.mimetype == "application/doc") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .PDF, .DOC and .DOCX format allowed!'));
        }
    }
})
module.exports = upload
