import React from 'react'
import Link from 'next/link'
import { inject, observer } from 'mobx-react'
import Clock from './Clock'
import SubredditSelector from './subredditSelector'
import SubredditPlot from './SubredditPlot'

@inject('store') @observer
class Page extends React.Component {
  componentDidMount () {
    this.props.store.start()
  }

  componentWillUnmount () {
    this.props.store.stop()
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
              <SubredditSelector />
            </div>
            <div>
              <h1>?</h1>
            </div>
          </div>
          <div style={contentRow}>
            <div style={chartContainer}>
              <SubredditPlot></SubredditPlot>
            </div>
          </div>
          <div style={contentRow}>
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
