const { staticStore } = require('shared/configureStore')

const addStore = (req, res, next) => {
  res.locals.store = staticStore
  next()
}

module.exports = addStore
