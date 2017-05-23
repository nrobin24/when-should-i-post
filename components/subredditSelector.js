import Dropdown from 'react-dropdown'
import {observer} from 'mobx-react'

const SubredditSelector = observer((props) => (
  <div>
    <style jsx global>{`
      .Dropdown-root {
        position: relative;
      }

      .Dropdown-control {
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 2px;
        box-sizing: border-box;
        color: #333;
        cursor: default;
        outline: none;
        padding: 8px 10px 8px 6px;
        transition: all 200ms ease;
        width: 280px;
      }


      .Dropdown-control:hover {
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
      }

      .Dropdown-arrow {
        border-color: #999 transparent transparent;
        border-style: solid;
        border-width: 5px 5px 0;
        content: ' ';
        display: block;
        height: 0;
        width: 0
      }

      .is-open .Dropdown-arrow {
        border-color: transparent transparent #999;
        border-width: 0 5px 5px;
      }

      .Dropdown-menu {
        background-color: white;
        border: 1px solid #ccc;
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
        box-sizing: border-box;
        margin-top: -1px;
        max-height: 200px;
        overflow-y: auto;
        position: absolute;
        top: 100%;
        width: 100%;
        z-index: 1000;
        -webkit-overflow-scrolling: touch;
      }

      .Dropdown-menu .Dropdown-group > .Dropdown-title {
        padding: 8px 10px;
        color: rgba(51, 51, 51, 1.2);
        font-weight: bold;
        text-transform: capitalize;
      }

      .Dropdown-option {
        box-sizing: border-box;
        color: rgba(51, 51, 51, 0.8);
        cursor: pointer;
        display: block;
        padding: 8px 10px;
      }

      .Dropdown-option:last-child {
        border-bottom-right-radius: 2px;
        border-bottom-left-radius: 2px;
      }

      .Dropdown-option:hover {
        background-color: #f2f9fc;
        color: #333;
      }

      .Dropdown-option.is-selected {
        background-color: #f2f9fc;
        color: #333;
      }

      .Dropdown-noresults {
        box-sizing: border-box;
        color: #ccc;
        cursor: default;
        display: block;
        padding: 8px 10px;
      }

      .Dropdown-placeholder {
          font-size: 1.6em;
          font-family: 'Rubik', sans-serif;
          color: #98E8E7;
      }
    `}
    </style>
    <Dropdown
      options={props.uiState.subredditNames}
      onChange={(newVal) => {
        props.dataState.setCurrentSubreddit(newVal.value)
      }}
      value={props.uiState.currentSubreddit.name}
      placeholder="Select an option"
    />
  </div>
))

export default SubredditSelector
