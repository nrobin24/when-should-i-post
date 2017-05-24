
import {action, observable, computed} from 'mobx'

class UiState {
  @observable loading = false
  @observable currentSubreddit = {}
  @observable currentSubredditName
  @observable subredditNames = []

  constructor() {
  }

  @action setSubreddit(name, newSubreddit) {
    this.currentSubreddit = newSubreddit
    this.currentSubredditName = name
  }

  // @computed get subreddits() {
  //   return this.
  // }


}

export default UiState
