module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 'core-js@3',
        targets: { browsers: '> 0.25%, not dead, not ie > 0' },
        modules: false
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@loadable/babel-plugin'
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
      sourceMaps: 'inline'
    },
    debug: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-syntax-dynamic-import'
      ],
      sourceMaps: 'inline',
      retainLines: true
    },
    tooling: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: 'commonjs',
            useBuiltIns: false,
            corejs: false,
            targets: { node: 'current' }
          }
        ]
      ]
    }
  }
}
