import React from 'react'
import Link from 'next/link'
import { inject, observer } from 'mobx-react'
import SubredditSelector from './SubredditSelector'
import SubredditPlot from './SubredditPlot'
import WordProbs from './WordProbs'

@inject('uiState', 'dataState') @observer
class Page extends React.Component {
  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    return (
      <div style={pageContainer}>
        <div style={contentContainer}>

          <div style={contentHeader}>
            <div style={titleContainer}>
              <h1>{'When should I post in'}</h1>
            </div>
            <div style={selectorContainer}>
              <SubredditSelector uiState={this.props.uiState} dataState={this.props.dataState}/>
            </div>
            <div>
              <h1>?</h1>
            </div>
          </div>
          <div style={contentRow}>
            <p>{this.props.uiState.selectedSubreddit}</p>
            <div style={chartContainer}>
              <SubredditPlot></SubredditPlot>
            </div>
          </div>
          <div style={contentRow}>
            <WordProbs uiState={this.props.uiState}/>
          </div>

        </div>
      </div>
    )
  }
}

const contentRow = {
    width: '100%',
    paddingTop: 12,
    paddingBottom:12
}

const titleContainer = {
  paddingRight: 6
}

const selectorContainer = {
  paddingRight: 6
}

const pageContainer = {
  width: '100vw',
  height: '100vh',
  backgroundColor: '#F9F9F9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: 20
}

const chartContainer = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
}

// STYLES
const contentContainer = {
  width: 600,
  height: 500
}

const contentHeader = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
}

export default Page
