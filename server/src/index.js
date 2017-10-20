import app from './app'
import http from 'http'
// import socket from 'socket.io'

// make http server
const server = http.createServer(app)

// db 연결
const db = require('./db')
db.connectDB()

// server open
const PORT = 3001
server.listen(PORT, () => {
  console.log(`server is connected on port ${PORT}`)
})