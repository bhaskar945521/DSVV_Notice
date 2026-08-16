require('dotenv').config()
const app = require('./app')
const connectDB = require('./config/db')
const fs = require('fs')
const path = require('path')

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const PORT = process.env.PORT || 5000

const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`🚀 DSVV Server running on port ${PORT}`)
    console.log(`📋 Environment: ${process.env.NODE_ENV}`)
    console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'demo'}`)
    console.log(`🗄️  MongoDB: ${process.env.MONGO_URI}`)
  })
}

start()
