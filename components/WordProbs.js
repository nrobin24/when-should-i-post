import {observer} from 'mobx-react'
const chroma = require('chroma-js')

// const scale = chroma.scale('RdYlBu').mode('lab')

const scale = chroma.scale(['hotpink', '#98E8E7'])
    .mode('lch')
    .correctLightness();
// const scale = chroma.scale(['lightyellow', 'navy']).domain([0.01, 0.5], 7, 'log');


const tag = (word, prob) => <div style={tagStyle(prob  * 4)} key={word}>{word}</div>

const WordProbs = observer((props) => {
  const probs = props.uiState.currentSubreddit.probs
  return (
    <div>
      <h2 style={{fontFamily: 'Rubik'}}>Upvoted posts frequently include these words:</h2>
      <div style={tagContainerStyle}>
        {Object.keys(probs).map((k) => tag(k, probs[k]))}
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
