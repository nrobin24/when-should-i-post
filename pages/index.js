import React from 'react'
import { Provider } from 'mobx-react'
import { initStore } from '../store'
import Page from '../components/Page'

import uiState from '../UiState'

export default class Counter extends React.Component {
  static getInitialProps ({ req }) {
    const isServer = !!req
    const store = initStore(isServer)
    return { lastUpdate: store.lastUpdate, isServer }
  }

  constructor (props) {
    super(props)
    this.store = initStore(props.isServer, props.lastUpdate)
  }

  render () {
    return (
      <div>
        <Provider uiState={uiState} >
          <Page />

        </Provider>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css?family=Inconsolata|Rubik');
          body {
            margin: 0 0 0 0;
          }
          h1 {
            font-family: 'Rubik', sans-serif;
            color: #A9B2B9;
            font-size: 1.6em
          }
          `}
        </style>
      </div>

    )
  }
}
