const React = require('react')
const { renderToString } = require('react-dom/server')
const { StaticRouter: Router } = require('react-router-dom')
const { Provider } = require('react-redux')
const { HelmetProvider } = require('react-helmet-async')
const StyleContext = require('isomorphic-style-loader/StyleContext')
// const IntlProvider = require('shared/i18n/IntlProvider')
const App = require('shared/containers/App').default

const helmetContext = {}
const routerContext = {}

const serverRenderer = () => (req, res) => {
  const css = new Set()
  const insertCss = (...styles) =>
    styles.forEach(style => css.add(style._getCss()))
  const content = renderToString(
    <Provider store={res.locals.store}>
      <Router location={req.url} context={routerContext}>
        <HelmetProvider context={helmetContext}>
          <StyleContext.Provider value={{ insertCss }}>
            <App />
          </StyleContext.Provider>
        </HelmetProvider>
      </Router>
    </Provider>
  )

  const state = JSON.stringify(res.locals.store.getState())

  const html = `<!doctype html>
    <html>
      <head>
        <script src="app.js" defer></script>
        <style>${[...css].join('')}</style>
      </head>
      <body>
        <div id="root">${content}</div>
      </body>
    </html>`
  console.log(state, content, html)
}

module.exports = serverRenderer
