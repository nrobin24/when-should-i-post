import { VictoryBar, VictoryChart, VictoryAxis, VictoryLine, VictoryTheme } from 'victory'
import { inject, observer } from 'mobx-react'
import * as R from 'ramda'
import moment from 'moment'
const chroma = require('chroma-js')

const aqua = chroma('aquamarine').luminance(0.6)
const purple = chroma('darkslateblue').luminance(0.3)

function toPlotData(data) {
  const {bin, count, med} = data
  return R.range(0, bin.length)
    .map(i => ({minute: bin[i] * 30, count: count[i], med: med[i]}))
}

export default observer(({uiState}) => {
  let data = []
  if (uiState.currentSubreddit.time_of_day) {
    data = toPlotData(uiState.currentSubreddit.time_of_day)
  }

  return (
    <svg width={600} height={300}>
      <g transform={"translate(75, 0)"}>
        <VictoryAxis

          fixLabelOverlap={true}
          standalone={false}
          tickFormat={(x) => moment.utc(0).add(x, 'minutes').format('hh:mm')}
          domain={[0,1440]}
          style={{
            axis: {
              stroke: "#CED7D6"
            },
            ticks: {
              stroke: "#CED7D6"
            },
            tickLabels: {
              fontFamily: 'Inconsolata',
              fontSize: 16,
              fill: "#A9B2B9"
            },
            grid: {
              // stroke: (t) => isMaxTick(t) ? "#A9B2B9" : "#CED7D6",
            }
          }}
        />

        <VictoryAxis
          dependentAxis
          standalone={false}
          label={"# of Posts"}
          tickFormat={(x) => x}
          style={{
            axisLabel: {
              padding: 40,
              fontFamily: 'Inconsolata',
              fontSize: 18,
              fill: aqua
            },
            axis: {
              stroke: "#CED7D6"
            },
            ticks: {
              stroke: aqua
            },
            tickLabels: {
              fontFamily: 'Inconsolata',
              fontSize: 14,
              fill: aqua
            }
          }}
        />
        <VictoryLine
          animate={{ duration: 500, easing: "bounce" }}
          standalone={false}
          data={data} x="minute" y="count"
          interpolation="monotoneX"
          style={{
            data: {stroke: aqua}
          }}
        />
        <VictoryAxis
          standalone={false}
          dependentAxis
          label={"Median Score"}
          orientation="right"
          tickFormat={(x) => x}
          style={{
            axisLabel: {
              padding: 40,
              fontFamily: 'Inconsolata',
              fontSize: 18,
              fill: purple
            },
            axis: {
              stroke: "#CED7D6"
            },
            ticks: {
              stroke: purple
            },
            tickLabels: {
              fontFamily: 'Inconsolata',
              fontSize: 14,
              fill: purple
            }
          }}
        />
        <VictoryLine
          animate={{ duration: 500, easing: "bounce" }}
          standalone={false}
          data={data} x="minute" y="med"
          interpolation="monotoneX"
          style={{
            data: {stroke: purple}
          }}
        />
      </g>
    </svg>
)})
