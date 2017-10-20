const User = require('db/models/user')
const Token = require('db/models/token')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const PassportLocalStrategy = require('passport-local').Strategy

/**
 * Return the Passport Local Strategy object.
 */

module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const { nickname, check } = req.body

  const userData = {
    email: email.trim(),
    password: password.trim(),
    nickname: nickname.trim(),
    rule: check
  }

  const newUser = new User(userData)
  return newUser.save((err) => {
    if (err) { return done(err) }

    // payload
    const payload = {
      _id: newUser._id
    }

    const refreshTokenOptions = {
      expiresIn: '60d',
      issuer: 'localhost:3000',
      subject: 'refreshToken'
    }

    // refresh Token 발급
    const refreshTokenKey = req.app.get('refreshTokenKey')
    const refreshToken = jwt.sign(payload, refreshTokenKey, refreshTokenOptions)

    const newToken = new Token({ _userId: newUser._id, refreshToken: refreshToken })

    return newToken.save((err) => {
      if (err) { return done(err) }

      // access Token 발급
      return jwt.verify(refreshToken, refreshTokenKey, (err, decoded) => {
        if (err) { return done(err) }

        const payload = {
          _id: decoded._id
        }

        const accessTokenOptions = {
          expiresIn: 720,
          issuer: 'localhost:3000',
          subject: 'accessToken'
        }

        const accessTokenKey = req.app.get('accessTokenKey')
        const accessToken = jwt.sign(payload, accessTokenKey, accessTokenOptions)

        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: 'jswo3901@gmail.com', // generated ethereal user
            pass: 'qorrn112' // generated ethereal password
          }
        })

        const mailOptions = {
          from: '노주상<jswo3901@gmail.com>',
          to: req.body.email,
          subject: 'localhost 가입인증 메일입니다',
          text: 'http://localhost:3000/confirm/' + accessToken
        }

        return transporter.sendMail(mailOptions, (error, info) => {
          if (error) { return done(error) }
          return done(null, info)
        })
      })
    })
  })
})