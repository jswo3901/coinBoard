const express = require('express')
const path = require('path')
const passport = require('passport')
const { localLoginStrategy, localSignupStrategy } = require('./middlewares/passport')
const app = express()
const secret = require('secret')
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.disable('etag')

// body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 요청 로그 콘솔에 띄우기
app.use(morgan('dev'))

// 클라이언트 빌드파일 직접 제공받게 설정
app.use(express.static(path.resolve(__dirname, '..', '..', 'client/build')))

// 시크릿 키 jwt
app.set('refreshTokenKey', secret.refreshTokenKey)
app.set('accessTokenKey', secret.accessTokenKey)

// passport
app.use(passport.initialize())
passport.use('local-signup', localSignupStrategy)
passport.use('local-login', localLoginStrategy)

const api = require('./routes/api')
const auth = require('./routes/auth')
const authCheckMiddleware = require('./middlewares/auth-check')

// app.use('/api', authCheckMiddleware)
app.use('/api', api)
app.use('/auth', auth)

// 에러핸들러
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.sendFile(path.join(__dirname, '..', '/public/error.html'))
})

module.exports = app