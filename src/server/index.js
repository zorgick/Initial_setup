'use strict'

const Hapi = require('@hapi/hapi')
// const Crumb = require('@hapi/crumb')
const Boom = require('@hapi/boom')
const Inert = require('@hapi/inert')
const PATH = require('path')
const userRoutes = require('server/routes/users')
const translationsRoutes = require('server/routes/translations')

const { HOST = 'localhost', PORT = 8070 } = process.env

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: HOST,
    routes: {
      // enable CORS
      cors: true,
      validate: {
        /**
         * Make this the default handler for validation failures. That
         * means anytime a user submits data that doesn't pass
         * validaiton, this functions handles it.
         */
        failAction: async (request, h, err) => {
          throw Boom.badRequest(err.message)
        }
      },
      files: {
        relativeTo: PATH.join(__dirname, 'public')
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/monitor',
    handler: (request, h) => {
      return h.response({ message: 'Hello World!' }).type('application/json')
    }
  })

  /**
   * this needs to finish before server.start()
   */
  await server.register([Inert, userRoutes, translationsRoutes])

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()
