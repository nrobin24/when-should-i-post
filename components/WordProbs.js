import {observer} from 'mobx-react'

const tag = (word, prob) => <div key={word}>{word}: {prob}</div>

const WordProbs = observer((props) => {
  const probs = props.uiState.currentSubreddit.probs
  return (
    <div>
      <h2>{props.uiState.currentSubreddit.name}</h2>
      {Object.keys(probs).map((k) => tag(k, probs[k]))}
    </div>
  )
})

export default WordProbs
