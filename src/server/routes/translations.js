const PATH = require('path')

/**
 * @typedef {Object} translationsP
 * @property {string} name Name of the plugin
 * @property {string} version Current version of the plugin
 * @property {function} register Function that registers plugin in the server
 */

/**
 * @type {translationsP}
 */

const translationsPlugin = {
  name: 'translation-routes',
  version: '1.0.0',
  register: async function (server, options) {
    /**
     * Get translations route
     */
    server.route({
      method: 'GET',
      path: '/locales/{lng}/{ns}.json',
      handler: (request, h) => {
        const { lng, ns } = request.params
        return h.file(PATH.join(`${lng}/`, `${ns}.json`))
      },
      options: {
        cache: {
          expiresIn: 3.154e10, // 1 year
          privacy: 'private'
        }
      }
    })
  }
}

module.exports = translationsPlugin
