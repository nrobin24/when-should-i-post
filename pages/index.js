import React from 'react'
import { Provider } from 'mobx-react'
// import { initStore } from '../store'
import Page from '../components/Page'

import UiState from '../state/UiState'
import DataState from '../state/DataState'

const uiState = new UiState()
const dataState = new DataState(uiState)

export default class Index extends React.Component {
  // static getInitialProps ({ req }) {
  //   const isServer = !!req
  //   const store = initStore(isServer)
  //   return { lastUpdate: store.lastUpdate, isServer }
  // }

  constructor (props) {
    super(props)
    // this.store = initStore(props.isServer, props.lastUpdate)
  }

  render () {
    return (
      <div>
        <Provider uiState={uiState} dataState={dataState}>
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
