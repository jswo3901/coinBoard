const mongoose = require('mongoose')
const { Schema } = mongoose

const tokenSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true }
})

module.exports = mongoose.model('Token', tokenSchema)