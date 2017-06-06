import {action, observable, computed} from 'mobx'
import R from 'ramda'
require('isomorphic-fetch');

const dataUrl = 'https://s3-us-west-2.amazonaws.com/nr-wsip/public/sub_data.json'

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
      if (!this.data) {
        return
      }
      console.log('got data')
      console.log(this.data)
      const subredditNames = this.data.map(d => d.subreddit_name)
      this.uiState.subredditNames = subredditNames
      // this.uiState.subredditNames = Object.keys(this.data)
      const name = subredditNames[0]
      this.uiState.setSubreddit(name, this.data[0].data)
    } catch (e) {
      console.error('loadData failed', e.message)
    }
  }

  @action
  setCurrentSubreddit(name) {
    const entry = R.find(R.propEq('subreddit_name', name), this.data)
    if (!entry) {
      throw new Error(`could not find subreddit: ${name}`)
    }
    this.uiState.setSubreddit(name, entry.data)
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
