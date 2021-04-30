import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {ReactQueryConfigProvider} from 'react-query'
import {App} from './app'

// when using react Query to do fetch, it will attempt a failed query at an interval
// we can control the query failure behavior by passing the following to ReactQueryConfigProvider
const queryConfig = {
  // config for queries only (not mutations)
  queries: {
    useErrorBoundary: true,
    // stop queries from being refetched when browser receivees focus again,
    // e,g. switching between tabs
    refetchOnWindowFocus: false,
    retry(failureCount, error) {
      if (error.status === 404) return false
      else if (failureCount < 2) return true
      else return false
    }
  }

}

loadDevTools(() => {
  ReactDOM.render(<ReactQueryConfigProvider config={queryConfig}><App /></ReactQueryConfigProvider>, document.getElementById('root'))
})
