// load passport strategies
const localSignupStrategy = require('./local-signup')
const localLoginStrategy = require('./local-login')

export { localLoginStrategy, localSignupStrategy }