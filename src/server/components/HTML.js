import * as React from 'react'
import * as PropTypes from 'prop-types'
import serialize from 'serialize-javascript'
import { WINDOW_STORE } from 'shared/utils/constants'

const Html = ({
  children,
  css = [], // just to escape a type error
  scripts = [],
  state = '{}',
  helmetContext: { helmet }
}) => (
  <html lang=''>
    <head>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      {helmet.base.toComponent()}
      {helmet.title.toComponent()}
      {helmet.meta.toComponent()}
      {helmet.link.toComponent()}
      {helmet.script.toComponent()}
      <style>${[...css].join('')}</style>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.${WINDOW_STORE} = ${serialize(state)}`
        }}
      />
    </head>
    <body>
      <div id='app' dangerouslySetInnerHTML={{ __html: children }} />
      {scripts}
    </body>
  </html>
)

Html.propTypes = {
  children: PropTypes.node,
  css: PropTypes.object,
  scripts: PropTypes.array,
  state: PropTypes.string,
  helmetContext: PropTypes.shape({
    helmet: PropTypes.object
  })
}

export default Html
