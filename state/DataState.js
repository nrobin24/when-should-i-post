import {action, observable, computed} from 'mobx'
require('es6-promise').polyfill();
require('isomorphic-fetch');

const dataUrl = 'https://s3-us-west-2.amazonaws.com/nr-wsip/public/data.json'

class DataState {
  @observable data = {}
  uiState

  constructor(uiState) {
    this.uiState = uiState
    this.loadData()
  }

  @action.bound
  loadData = async () => {
    try {
      this.data = await fetch(dataUrl).then(r => r.json())
      this.uiState.subredditNames = this.data.subreddits.map(d => d.name)
      this.uiState.setSubreddit(this.data.subreddits[0])
    } catch (e) {
      console.error('loadData failed', e.message)
    }
  }

  @action
  setCurrentSubreddit(name) {
    const names = this.data.subreddits.map(d => d.name)
    const i = names.indexOf(name)
    if (i < 0) {
      throw new Error(`could not find subreddit: ${name}`)
    }
    this.uiState.setSubreddit(this.data.subreddits[i])
  }
//   @computed get bathTempData() {
//     return this.bathTempHistory.slice()
//   }
//
//   @action.bound
//   pushBathTemp(newTemp) {
//     this.bathTempHistory.push({time: new Date(), temp: newTemp})
//     if (this.dummyPointCount) {
//       this.bathTempHistory.shift()
//       this.dummyPointCount -= 1
//     }
//   }
//
//   @action.bound
//   start = async (setPoint) => {
//     this.startReqInFlight = true
//     try {
//       const resp = await start(setPoint)
//       this.running = true
//       this.chatState.onCookStart(setPoint)
//     } catch (e) {
//       console.error('start error:' + JSON.stringify(e))
//       console.error(e)
//     } finally {
//       this.startReqInFlight = false
//     }
//   }
//
//   @action.bound
//   async stop() {
//     this.stopReqInFlight = true
//     try {
//       const resp = await stop()
//       this.running = false
//       this.chatState.onCookStop()
//     } catch (e) {
//       console.error('stop error')
//       console.error(e)
//       throw new Error(e)
//     } finally {
//       this.stopReqInFlight = false
//     }
//   }
//
//   @action.bound
//   async update() {
//     if (this.updateReqInFlight) {
//       return
//     }
//
//     this.updateReqInFlight = true
//     try {
//       const resp = await getStatus()
//       if (!resp) {
//         return
//       }
//       console.log(resp)
//       this.pushBathTemp(resp.dataPoint.bathTemp)
//
//       if (resp.program) {
//         this.running = true
//       } else {
//         this.running = false
//       }
//
//       this.gotFirstUpdate = true
//
//     } catch (e) {
//       console.error('update error')
//       console.error(JSON.stringify(e))
//     } finally {
//       this.updateReqInFlight = false
//     }
//   }
//
//   @action startUpdating() {
//     this.updateIntervalRef = setInterval(() => this.update(), 3000)
//   }
//
//   @action stopUpdation() {
//     clearInterval(this.updateIntervalRef)
//   }
}

export default DataState