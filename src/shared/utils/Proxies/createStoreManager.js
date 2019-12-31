import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createReducer from 'shared/reducers'

const { NODE_ENV } = process.env

/**
 * @typedef {Object} StoreManager
 * @property {Object} getStore Proxy that wraps around configureStore function and does extra checks
 * @property {Function} [createStoreWithMiddlewares] Function that adds additional functionality
 * to the dispatch
 * @property {Function} [addHotReducers] Function that enables HMR for reducers
 * to the reducers
 *
 */

/**
 * Creates proxy getStore function that enables several checks before creation of the store
 * @param {Function} configureStore Function that creates redux store
 */
const createStoreManager = configureStore => {
  /**
   * @type {StoreManager}
   */
  return {
    createEnhancer () {
      const middleware = [thunk]
      const devMiddlewares = []
      if (NODE_ENV === 'development') {
        const createLogger = require('redux-logger').createLogger // eslint-disable-line global-require
        const reduxImmutableStateInvariant = require('redux-immutable-state-invariant')
          .default // eslint-disable-line global-require

        devMiddlewares.push(createLogger())
        /**
         * reduxImmutableStateInvariant spits an error when you
         * try to mutate your state either inside a dispatch or
         * between dispatches
         */
        devMiddlewares.push(reduxImmutableStateInvariant())
      }
      Reflect.set(
        this,
        'enhancer',
        applyMiddleware(...middleware, ...devMiddlewares)
      )
      return Reflect.get(this, 'enhancer')
    },

    createStoreWithMiddlewares (initialData) {
      return createStore(
        createReducer(),
        initialData,
        Reflect.get(this, 'enhancer') || this.createEnhancer()
      )
    },

    addHotReducers (storeInstance) {
      if (NODE_ENV === 'development' && module.hot) {
        module.hot.accept('shared/reducers', () => {
          storeInstance.replaceReducer(
            createReducer(storeInstance.asyncReducers)
          )
        })
      }
    },

    getStore: new Proxy(configureStore, {
      apply (target, context, args) {
        // There must be only one instance for client- and server-side accordingly

        /**
         * If the invokation was made with args, then it is definitely
         * a client-side invokation and a new instance must be created
         */
        let result
        if (args.length !== 0) {
          // call it even if args[0] === undefined (dev mode)
          result = Reflect.apply(target, context, args)
          context.addHotReducers(result)
        } else if (Reflect.get(context, 'store')) {
          // return existing store for client or server
          result = Reflect.get(context, 'store')
        } else {
          // server-side invokation
          result = Reflect.apply(target, context, args)
        }
        return result
      }
    })
  }
}

export default createStoreManager
