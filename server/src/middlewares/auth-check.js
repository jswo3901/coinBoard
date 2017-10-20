const jwt = require('jsonwebtoken')
const User = require('db/models/user')
/**
 *  The Auth Checker middleware function.
 */

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.json({
      result: false
    })
  }

  // 토큰얻기
  const accessToken = req.headers.authorization
  const accessTokenKey = req.app.get('accessTokenKey')
  // 디코딩 토큰
  return jwt.verify(accessToken, accessTokenKey, (err, decoded) => {
    // access 토큰 만료
    if (err) {
      // 비밀번호 입력이라든지? = 리프레쉬 토큰 검증 위함
      return res.json({
        result: 'needRefresh',
        msg: 'access token 만료'
      })
    }
    // 만료 안됐을 경우
    const userId = decoded._id
    return User.findOne({ _id: userId }, (userErr, user) => {
      if (userErr || !user) {
        return res.json({
          result: false,
          msg: '해당 계정 없음 : 잘못된 토큰 정보'
        })
      }
      // 인증 완료
      return next()
    })
  })
}