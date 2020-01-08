const React = require('react')
const PATH = require('path')
const { renderToString } = require('react-dom/server')
const { StaticRouter: Router } = require('react-router-dom')
const { Provider } = require('react-redux')
const { HelmetProvider } = require('react-helmet-async')
const StyleContext = require('isomorphic-style-loader/StyleContext')
const { ChunkExtractor, ChunkExtractorManager } = require('@loadable/server')

// const IntlProvider = require('shared/i18n/IntlProvider')
const Html = require('server/components/HTML').default
const App = require('shared/containers/App').default
const IntlProvider = require('shared/i18n/IntlProvider').default

const helmetContext = {}
const routerContext = {}

const serverRenderer = paths => (req, res) => {
  const statsFile = PATH.resolve(
    PATH.join(paths.clientBuild, paths.publicPath),
    'loadable-stats.json'
  )
  const extractor = new ChunkExtractor({ statsFile, entrypoints: ['app'] })

  const css = new Set()
  const insertCss = (...styles) =>
    styles.forEach(style => css.add(style._getCss()))

  const content = renderToString(
    <ChunkExtractorManager extractor={extractor}>
      <Provider store={res.locals.store}>
        <Router location={req.url} context={routerContext}>
          <StyleContext.Provider value={{ insertCss }}>
            <IntlProvider acceptedLng={req.acceptsLanguages('ru', 'en')}>
              <HelmetProvider context={helmetContext}>
                <App />
              </HelmetProvider>
            </IntlProvider>
          </StyleContext.Provider>
        </Router>
      </Provider>
    </ChunkExtractorManager>
  )

  const scriptTags = extractor.getScriptElements()

  const state = JSON.stringify(res.locals.store.getState())

  res.send(
    '<!doctype html>' +
      renderToString(
        <Html
          // @ts-ignore
          css={css}
          // @ts-ignore
          helmetContext={helmetContext}
          scripts={scriptTags}
          state={state}
        >
          {content}
        </Html>
      )
  )
}

module.exports = serverRenderer
