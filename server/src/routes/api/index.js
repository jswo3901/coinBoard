const api = require('express').Router()
const apiCtrl = require('./api.ctrl')

api.route('/islogin')
  .get(apiCtrl.login)

api.route('/discussion/newDiscussion')
  .post(apiCtrl.myRoom)

module.exports = api