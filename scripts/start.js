import rimraf from 'rimraf'
import paths from 'config/paths'
import { clientOnly } from 'scripts/utils'

rimraf.sync(paths.clientBuild)
rimraf.sync(paths.serverBuild)

if (clientOnly()) {
  require('./start-client')
}
// else {
//   require('./start-ssr')
// }
