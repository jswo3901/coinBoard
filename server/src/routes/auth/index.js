const auth = require('express').Router()
const authCtrl = require('./auth.ctrl')

auth.route('/register')
  .post(authCtrl.register)

auth.route('/login')
  .post(authCtrl.login)

auth.route('/confirm/:token')
  .get(authCtrl.confirm)

auth.route('/reconfirm/:email')
  .get(authCtrl.reConfirm)

auth.route('/refresh')
  .get(authCtrl.refresh)

module.exports = auth