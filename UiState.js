import {observable, computed} from 'mobx';

class UiState {
  @observable pendingRequestCount = 0;
  @observable selectedSubreddit = '';

  constructor() {

  }
}

const singleton = new UiState();
export default singleton;
