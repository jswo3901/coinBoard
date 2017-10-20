import mongoose from 'mongoose'

export const connectDB = () => {
  const dbURL = 'mongodb://localhost:27017/coin'
  console.log('db연결 시도중...')
  mongoose.Promise = global.Promise
  mongoose.connect(dbURL, {
    config: { autoIndex: false },
    useMongoClient: true
  })
  const database = mongoose.connection
  database.on('error', console.error.bind(console, 'db error '))
  database.on('open', () => {
    console.log('db 연결 성공')
  })
  database.on('disconnected', () => {
    console.log('db 연결 끊김...재연결 시도')
    setInterval(connectDB, 1000)
  })
}