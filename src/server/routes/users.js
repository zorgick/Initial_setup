const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')
const low = require('lowdb')
const MemorySync = require('lowdb/adapters/Memory')
const initUserCollection = require('server/db/users.json')

/**
 * @typedef {Object} UsersP
 * @property {string} name Name of the plugin
 * @property {string} version Current version of the plugin
 * @property {function} register Function that registers plugin in the server
 */

// create a lowdb database using the memory adapter
const db = low(new MemorySync())

/**
 * initialize the database with data from json file
 * after any interaction that changes the database, use `write()` to commit
 * changes
 */
db.defaults({ users: initUserCollection }).write()

/**
 * store an id, this is for creating new users, and makes sure we don't assign
 * same id twice
 */
let uuid = initUserCollection.length + 1

const userPostRequestSchema = Joi.object({
  first_name: Joi.string()
    .min(3)
    .max(64)
    .required(),
  last_name: Joi.string()
    .min(3)
    .max(64),
  city: Joi.string()
    .min(1)
    .max(64),
  country: Joi.string()
    .min(1)
    .max(64)
    .required()
})

/**
 * @type {UsersP}
 */

const usersPlugin = {
  name: 'user-routes',
  version: '1.0.0',
  register: async function (server, options) {
    /**
     * list users route
     */
    server.route({
      method: 'GET',
      path: '/user',
      /*
       and define the handler
       the handler passes two objects, request and h
       - request is the server request object, it gives access to the the request and the server internals
       - h is the response toolkit, and it helps with modifying the response (like adding response code)
      */
      handler: (request, h) => {
        // get all users from users array
        const users = db.get('users').value()
        // returning users array will be converted to a json array by hapi
        return users
      }
    })

    /**
     * get single user by id
     */
    server.route({
      method: 'GET',
      path: '/user/{id}',
      handler: (request, h) => {
        const { id } = request.params
        const user = db
          .get('users')
          .find({ id: parseInt(id, 10) })
          .value()

        if (user !== undefined) {
          return user
        }
        throw Boom.badRequest(`id ${id} not found`)
      }
    })

    /**
     * create user
     */
    server.route({
      method: 'POST',
      path: '/user',
      config: {
        validate: {
          /**
           * payload validation
           * This will prevent sending an object that doesn't have the required
           * parameters.
           * The error handler is defined globaly in server.js, you may find
           * that you want to customize the response per-reoute
           * in which case you can define it here under failAction
           */
          payload: userPostRequestSchema
        }
      },
      handler: (request, h) => {
        // get user from payload using object destructuring
        const {
          first_name: firstName,
          last_name: lastName,
          city,
          country
        } = request.payload

        // generate an id using the uuid
        const id = uuid

        // increment the uuid (for next user)
        uuid += 1

        // create the user object
        const newUser = { id, firstName, lastName, city, country }

        // push user into the database and write changes
        db.get('users')
          .push(newUser)
          .write()

        // return a success message and the new id
        return { message: 'user created', id }
      }
    })
  }
}

module.exports = usersPlugin
