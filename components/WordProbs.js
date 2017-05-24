import {observer} from 'mobx-react'
const chroma = require('chroma-js')
import R from 'ramda'

// const scale = chroma.scale('RdYlBu').mode('lab')

const scale = chroma.scale(['hotpink', '#98E8E7'])
    // .mode('lch')
    // .correctLightness();
// const scale = chroma.scale(['lightyellow', 'navy']).domain([0.01, 0.5], 7, 'log');


const tag = ([word, prob]) => <div style={tagStyle(prob * 50)} key={word}>{word}</div>

const WordProbs = observer((props) => {

  let best = []
  let worst = []

  if (props.uiState.currentSubreddit.words) {
    best = R.zip(
      props.uiState.currentSubreddit.words.best.words,
      props.uiState.currentSubreddit.words.best.probs
    )
    worst = R.zip(
      props.uiState.currentSubreddit.words.worst.words,
      props.uiState.currentSubreddit.words.worst.probs
    )
  }

  if (!best.length | !worst.length) {
    return (<div></div>)
  }

  return (
    <div>
      <h2 style={{fontFamily: 'Rubik'}}>Upvoted posts frequently include these words:</h2>
      <div style={tagContainerStyle}>
        {best.map(tag)}
      </div>
      <h2 style={{fontFamily: 'Rubik'}}>But rarely include these words:</h2>
      <div style={tagContainerStyle}>
        {worst.map(tag)}
      </div>
    </div>
  )
})

export default WordProbs

const tagContainerStyle = {
  width: '100%',
  display: 'flex'
}

const tagStyle = (prob) => ({
  fontFamily: 'Inconsolata',
  display: 'flex',
  borderRadius: 8,
  padding: 8,
  margin: 5,
  backgroundColor: scale(prob).hex()
})
