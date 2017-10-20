const passport = require('passport')
const Joi = require('joi')
const User = require('db/models/user')
const jwt = require('jsonwebtoken')
const Token = require('db/models/token')
const nodemailer = require('nodemailer')

/* 
    POST /auth/confirmMail
*/
// http://localhost:3000/confirm/blah~~

// 이메일 재인증
exports.reConfirm = (req, res) => {
  const email = req.params.email
  return User.findOne({ email: email }, (userErr, user) => {
    if (userErr || !user) {
      return res.status(200).json({
        result: false,
        msg: '가입 정보가 존재하지 않습니다'
      })
    }
    const userId = user._id
    return Token.findOne({ _userId: userId }, (tokenErr, token) => {
      if (tokenErr || !token) {
        return res.status(200).json({
          result: false,
          msg: '가입 정보가 존재하지 않습니다'
        })
      }
      const refreshToken = token.refreshToken
      const refreshTokenKey = req.app.get('refreshTokenKey')
      return jwt.verify(refreshToken, refreshTokenKey, (err, decoded) => {
        if (err) {
          return res.status(200).json({
            result: false,
            msg: '가입 후 60일이 지나 계정 정보가 삭제되었습니다 다시 가입해 주세요'
          })
        }
        const userId = decoded._id

        const payload = {
          _id: userId
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
          to: email,
          subject: 'localhost 가입인증 메일입니다',
          text: 'http://localhost:3000/confirm/' + accessToken
        }

        return transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            // console.log(error)
            return res.status(200).json({
              result: false,
              msg: '메일전송 실패'
            })
          }
          return res.status(200).json({
            result: true,
            msg: '인증 메일이 재전송되었습니다'
          })
        })
      })
    })
  })
}

exports.confirm = (req, res, next) => {
  const accessToken = req.params.token
  if (!accessToken) {
    return res.status(400).json({
      result: false,
      msg: '잘못된 주소입니다. 인증 메일을 다시 받으세요'
    })
  }

  const accessTokenKey = req.app.get('accessTokenKey')
  // 토큰 검증
  return jwt.verify(accessToken, accessTokenKey, (err, decoded) => {
    if (err) {
      return res.status(200).json({
        result: false,
        msg: '유효하지 않은 인증메일입니다. 인증 메일을 다시 받으세요'
      })
    }

    const userId = decoded._id

    return User.findById({ _id: userId }, (userErr, user) => {
      if (userErr || !user) {
        return res.status(200).json({
          result: false,
          msg: '계정정보가 존재하지 않습니다. 인증 메일을 다시 받아보세요'
        })
      }
      if (user.isVerified) {
        return res.status(200).json({
          result: false,
          msg: '이미 인증된 계정입니다'
        })
      }
      user.isVerified = true
      user.save((err) => {
        if (err) { return res.status(401) }
        res.status(200).json({
          result: true,
          msg: '인증이 성공적으로 완료되었습니다'
        })
      })
    })
  })
}

exports.register = (req, res, next) => {
  const { email, password, nickname, passwordConfirm, check } = req.body

  const regData = {
    email: Joi.string().email(),
    password: Joi.string().regex(/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/),
    nickname: Joi.string().regex(/^[a-z0-9A-Z가-힣]{4,8}$/)
  }

  const valResult = Joi.validate({
    email: email,
    password: password,
    nickname: nickname
  }, regData)

  if (valResult.error) {
    return res.json({
      message: valResult.error.details[0].context.key + ' 유효성이 올바르지 않습니다',
      success: false
    })
  }

  if (password !== passwordConfirm) {
    return res.json({
      success: false,
      message: '비밀번호가 일치하지 않습니다.'
    })
  }

  if (!check) {
    return res.json({
      success: false,
      message: '약관에 동의해 주세요'
    })
  }

  return passport.authenticate('local-signup', (err, info) => {
    if (err) {
      if (err.name === 'ValidationError') {
        // 11000 코드 : 중복 에러
        return res.json({
          success: false,
          message: '이미 가입한 이메일 주소입니다'
        })
      }

      return res.status(400).json({
        success: false,
        message: '알 수 없는 오류가 발생했습니다. 새로고침 후 진행해 주세요'
      })
    }

    return res.status(200).json({
      success: true,
      message: info.accepted[0] // email 정보
    })
  })(req, res, next)
}

/* 
  POST /auth/login
    {
      loginEmail,
      loginPassword
    }
*/

exports.login = (req, res, next) => {
  return passport.authenticate('local-login', (err, token, data) => {
    if (err) {
      return res.status(400)
    }
    return res.json({
      data,
      token
    })
  }
  )(req, res, next)
}

exports.refresh = (req, res) => {
  if (!req.headers.authorization) {
    return res.json({
      result: false
    })
  }
  // 토큰얻기
  const refreshToken = req.headers.authorization
  const refreshTokenKey = req.app.get('refreshTokenKey')

  return jwt.verify(refreshToken, refreshTokenKey, (err, decoded) => {
    // refresh 토큰 만료 - 재로그인필요
    if (err) { return res.status(200).json({ accessToken: null }) }
    const userId = decoded._id

    // 중복 로그인 방지
    return Token.findOne({ _userId: userId }, (tokenErr, token) => {
      if (tokenErr || !token) {
        return res.status(401).json({ accessToken: null })
      }

      if (token.refreshToken === refreshToken) {
        return User.findOne({ _id: userId }, (userErr, user) => {
          if (userErr || !user) {
            return res.status(200).json({ accessToken: null })
          }
          // access 토큰 발급
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

          return res.json({
            accessToken
          })
        })
      } else {
        return res.status(401).json({ accessToken: null })
      }
    })
  })
}