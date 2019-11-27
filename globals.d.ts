interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: Function;
}

declare interface NodeModule {
  hot: {
    accept(path?: string, callback?: () => void): void
  }
}