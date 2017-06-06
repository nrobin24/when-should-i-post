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
        <a href="https://github.com/nrobin24/when-should-i-post">
          <img
            className='fork-style'
            src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67"
            alt="Fork me on GitHub"
            data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"
          ></img>

        </a>
        <Provider uiState={uiState} dataState={dataState}>
          <Page />

        </Provider>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css?family=Inconsolata|Rubik');
          body {
            margin: 0 0 0 0;
          }
          h1, h2 {
            font-family: 'Rubik', sans-serif;
            color: #A9B2B9;
          }
          h1 {
            font-size: 1.6em
          }
          h2 {
            font-size: 1.2em
          }
          .fork-style {
            position: absolute; top: 0; right: 0; border: 0;
          }
          `}
        </style>
      </div>

    )
  }
}
