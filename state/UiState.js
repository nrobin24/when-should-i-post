
import {action, observable, computed} from 'mobx'

class UiState {
  @observable loading = false
  @observable currentSubreddit = {name: "...", probs: {}}
  @observable subredditNames = []

  constructor() {
  }

  @action setSubreddit(newSubreddit) {
    this.currentSubreddit = newSubreddit
  }

  // @computed get subreddits() {
  //   return this.
  // }


}

export default UiState
