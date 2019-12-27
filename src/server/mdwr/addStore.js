const storeManager = require('shared/configureStore').default

const addStore = (req, res, next) => {
  res.locals.store = storeManager.getStore()
  next()
}

module.exports = addStore
