const React = require('react')
const { renderToString } = require('react-dom/server')
const { StaticRouter: Router } = require('react-router-dom')
const { Provider } = require('react-redux')
const { HelmetProvider } = require('react-helmet-async')
// const IntlProvider = require('shared/i18n/IntlProvider')
const App = require('shared/containers/App').default

const helmetContext = {}
const routerContext = {}

const serverRenderer = () => (req, res) => {
  const content = renderToString(
    <Provider store={res.locals.store}>
      <Router location={req.url} context={routerContext}>
        <HelmetProvider context={helmetContext}>
          <App />
        </HelmetProvider>
      </Router>
    </Provider>
  )

  const state = JSON.stringify(res.locals.store.getState())
  console.log(state, content)
}

module.exports = serverRenderer
