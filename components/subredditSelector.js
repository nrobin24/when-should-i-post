import Dropdown from 'react-dropdown'
import {observer} from 'mobx-react'
import Autosuggest from 'react-autosuggest'
import React from 'react'
import R from 'ramda'


// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value , subreddits) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = value.length;

  return inputLength === 0 ? subreddits.slice() : subreddits.filter(sub => {
    return sub.toLowerCase().slice(0, inputLength) === inputValue
  })
}

const getSuggestionValue = suggestion => suggestion

const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
)

@observer
class SubredditSelector extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: "",
      suggestions: []
    }
  }

  onChange = (event, {newValue}) => {
    this.setState({
      value: newValue
    })

    if (R.contains(newValue, this.props.uiState.subredditNames)) {
      this.props.dataState.setCurrentSubreddit(newValue)
    }
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value, this.props.uiState.subredditNames)
    })
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }


  render() {
    const {value, suggestions} = this.state
    const inputProps = {
      placeholder: 'subreddit goes here',
      value,
      onChange: this.onChange
    }

    return (
      <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          shouldRenderSuggestions={() => true}
        />
        <style jsx global>
        {`.react-autosuggest__container {
            position: relative;
          }

          .react-autosuggest__input {
            width: 240px;
            height: 30px;
            padding: 10px 20px;
            font-size: 1.6em;
            font-family: 'Rubik', sans-serif;
            border: 1px solid #aaa;
            color: rgba(51, 51, 51, 0.8);
            border-radius: 4px;
          }

          .react-autosuggest__input--focused {
            outline: none;
          }

          .react-autosuggest__input--open {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }

          .react-autosuggest__suggestions-container {
            display: none;
          }

          .react-autosuggest__suggestions-container--open {
            display: block;
            position: absolute;
            top: 51px;
            width: 280px;
            border: 1px solid #aaa;
            background-color: #fff;
            color: rgba(51, 51, 51, 0.8);
            font-family: Helvetica, sans-serif;
            font-weight: 300;
            font-size: 16px;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            z-index: 2;
          }

          .react-autosuggest__suggestions-list {
            margin: 0;
            padding: 0;
            list-style-type: none;
          }

          .react-autosuggest__suggestion {
            cursor: pointer;
            padding: 10px 20px;
          }

          .react-autosuggest__suggestion--highlighted {
            background-color: #ddd;
          }
        `}
        </style>
      </div>
    )
  }
}

export default SubredditSelector
