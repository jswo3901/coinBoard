const User = require('db/models/user')
const Token = require('db/models/token')
const PassportLocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy(
  {
    usernameField: 'loginEmail',
    passwordField: 'loginPassword',
    session: false,
    passReqToCallback: true
  },
  (req, loginEmail, loginPassword, done) => {
    let refreshToken = null // user
    let data = { // data
      result: false,
      msg: undefined,
      nickname: undefined
    }

    return User.findOne({ email: loginEmail }, (err, user) => {
      if (err) { return done(err) }
      if (!user) {
        data.msg = '이메일 없엉'
        return done(null, refreshToken, data)
      }
      return user.comparePassword(loginPassword, (passwordErr, isMatch) => {
        if (passwordErr) { return done(passwordErr) }
        if (!isMatch) {
          data.msg = '비밀번호 안맞아'
          return done(null, refreshToken, data)
        }
        if (user.isVerified) {
          // payload
          const payload = {
            _id: user._id
          }

          // options
          const refreshTokenOptions = {
            expiresIn: '60d',
            issuer: 'localhost:3000',
            subject: 'refreshToken'
          }

          // update refresh token
          const refreshTokenKey = req.app.get('refreshTokenKey')
          refreshToken = jwt.sign(payload, refreshTokenKey, refreshTokenOptions)
          return Token.findOne({ _userId: user._id }, (tokenErr, token) => {
            if (tokenErr || !token) {
              return done(tokenErr)
            }
            token.refreshToken = refreshToken
            return token.save((err) => {
              if (err) { return done(err) }
              // create new access token
              return jwt.verify(refreshToken, refreshTokenKey, (err, decoded) => {
                if (err) { return done(err) }
                const userId = decoded._id

                // payload
                const payload = {
                  _id: userId
                }

                // options
                const accessTokenOptions = {
                  expiresIn: 720,
                  issuer: 'localhost:3000',
                  subject: 'accessToken'
                }

                const accessTokenKey = req.app.get('accessTokenKey')
                const accessToken = jwt.sign(payload, accessTokenKey, accessTokenOptions)

                const token = {accessToken: accessToken, refreshToken: refreshToken}
                
                data.nickname = user.nickname
                data.result = true
                return done(null, token, data)
              })
            })
          }
          )
        } else {
          data.msg = '인증되지 않은 이메일'
          return done(null, refreshToken, data)
        }
      })
    })
  }
)