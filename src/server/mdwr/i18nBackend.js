const FS = require('fs')

const localesDir = `${__dirname}/locales`

// This middleware serves translation files requested via /locales/:locale/:ns
const getTraslation = (req, res) => {
  const { locale, ns } = req.params

  try {
    const values = FS.readFileSync(`${localesDir}/${locale}/${ns}.json`, {
      encoding: 'utf-8'
    })
    res.set('Cache-Control', `private, max-age=${3.154e10}`)

    return res.send(values)
  } catch (error) {
    console.log(error.message)
    return res.send(null)
  }
}

module.exports = { getTraslation }
