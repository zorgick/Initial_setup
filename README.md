# How to initialize

1. Clone the repo
2. Pull tags
3. Install dependencies
4. Create **.env** file in the root directory of your project (if needed) and list environment variables there. They will be collected by dotenv package. For **client-side**, add env variables you want to use in *./config/env.js*
5. Execute one of the scripts listed below

# Code of conduct

**GIT must be aware of ALL changes in the working tree, so instead of using bash commands, like <kbd>mv</kbd> or <kbd>rm</kbd> or using GUI, opt for <kbd>git mv</kbd> or <kbd>git rm</kbd>**

# NPM scripts

`npm start`

Launches the SSR-bundled app in the development mode. Express serves static files from **dist/client** directory and renders on the server the markup for the requested url with a necessary part of the redux store. Changes in the code are monitored by HMR. 

`npm start --pl`

Launches the client-bundled app in the development mode. Express serves static files from **dist/client** directory. Changes in the code are monitored by HMR. 

`npm run build`

Creates a SSR bundle for production. Generates static html markup with initial view (request url = '/' - can be changed if needed). 

`npm run build --pl`

Creates a client bundle for production. 

`npm test`

Runs tests against all **changed** files. 

`npm run test:build`

Runs tests against all files. Used in a hook before the commit. 

`npm run test:debug`

Helps to detect an error in the test environment. 

`npm run docs`

Generates a documentation for the provided file that includes jsdoc markup. 

`npm run typejs`

Type checks the code according to the tsconfig.json in the root of the project.

`npm run checkall`

Does all sorts of checks. Used before the commit. 

# Composition of the component enhancers

Generally it doesn't matter except HOCs, that need an access to the props, e.g.

<b> The right way </b>
```
  import { compose } from 'redux'
  import { connect } from 'react-redux'
  const withConnect = connect(mapStateToProps)
  /**
    * withReducer needs access to the props provided by 
    * react-redux connect utility
    */
  compose(withReducer, withConnect, withLanguage)(MyComp)
```

<b> The wrong way </b>
```
  import { compose } from 'redux'
  import { connect } from 'react-redux'
  const withConnect = connect(mapStateToProps)
  /**
    * The component won't render since withReducer didn't get the props
    */
  compose(withConnect, withReducer, withLanguage)(MyComp)
```

# TODO

- [] Add missing translation namespace on the initial request
