import * as React from 'react'
import storeManager from 'shared/configureStore'

const store = storeManager.getStore()
/**
 * This function is a sort of a middleware - it serves to join the
 * logic behind HOC and async redux store. <br />
 * GOAL: dynamically update a global redux store by injecting async reducers
 * @param {Function} createReducer function that injects async reducers.
 * @see [Twitter's approach](http://nicolasgallagher.com/redux-modules-and-code-splitting/)
 * @see [Abramov's approach](https://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application)
 * @returns {Function} HOF
 * @example <caption>Step 1:</caption>
 * // `createInjectReducer` is called only once per runtime with createReducer:
 * export default createInjectReducer(createReducer)
 *
 * @example <caption>Step 2:</caption>
 * injectReducer({key: 'active', reducer})
 *
 * @example <caption>Step 3:</caption>
 * export default withReducer(Active)
 */

export default function createInjectReducer(createReducer) {
  return ({ key, reducer }) => Component =>
    class WithReducer extends React.PureComponent {
      constructor(props) {
        super(props)

        /**
         * Check the existance of the provided **key** ([[SCOPE]]) in the asyncReducers dictionary
         * and compare its value with the provided **reducer** ([[SCOPE]])
         * if not -> add the **reducer** to the dictionary
         */
        if (!(store.asyncReducers[key] && store.asyncReducers[key] === reducer)) {
          store.asyncReducers[key] = reducer

          /**
           * Update global store with *asyncReducers*.
           */

          store.replaceReducer(createReducer(store.asyncReducers))
        }
      }

      static displayName = `withReducer(${Component.displayName ||
        Component.name ||
        'Component'})`

      render() {
        return <Component {...this.props} />
      }
    }
}
