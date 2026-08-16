const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname, '../../../uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `notice-${unique}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx']
  const ext = path.extname(file.originalname).toLowerCase()
  if (!allowed.includes(ext)) {
    return cb(new Error('Only PDF and Word documents are allowed.'), false)
  }
  if (!['application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)) {
    return cb(new Error('Invalid MIME type.'), false)
  }
  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024 },
})

module.exports = upload
