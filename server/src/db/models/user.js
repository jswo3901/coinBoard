const mongoose = require('mongoose')
const { Schema } = mongoose
const uniqueValidator = require('mongoose-unique-validator')
// 해싱
const bcrypt = require('bcrypt')

// user 스키마
const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  nickname: String,
  rule: Boolean,
  isVerified: {type: Boolean, default: false}
})

userSchema.plugin(uniqueValidator)

// 비밀번호 대조
userSchema.methods.comparePassword = function comparePassword(loginPassword, callback) {
  bcrypt.compare(loginPassword, this.password, callback)
}

// 비밀번호 해싱 -> save 전에 실행
userSchema.pre('save', function saveHook(next) {
  const user = this

  if (!user.isModified('password')) return next()

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError) }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError) }

      // 비밀번호 해싱
      user.password = hash

      return next()
    })
  })
})

module.exports = mongoose.model('User', userSchema)