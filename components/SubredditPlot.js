import { VictoryBar, VictoryChart, VictoryAxis, VictoryLine, VictoryTheme } from 'victory'
import * as R from 'ramda'

const myData = {
  max: 3,
  points: [
    {day: 1, posts: 4},
    {day: 2, posts: 7},
    {day: 3, posts: 9},
    {day: 4, posts: 2},
    {day: 5, posts: 2},
    {day: 6, posts: 5},
    {day: 7, posts: 3},
  ]
}

const isMaxTick = R.equals(myData.max)

export default () => (
  <VictoryChart
    height={400}
    width={600}
    domainPadding={20}
    theme={VictoryTheme.material}
  >
    <VictoryAxis
      domain={[1,7]}
      tickValues={[1, 2, 3, 4, 5, 6, 7]}
      tickFormat={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
      style={{
        axis: {
          stroke: "#CED7D6"
        },
        ticks: {
          stroke: "#CED7D6"
        },
        tickLabels: {
          fontSize: 20,
          // fill: "#98E8E7",
          fill: (t) => isMaxTick(t) ? "#98E8E7" : "#CED7D6",
          fontWeight: (t) => isMaxTick(t) ? "bold" : "regular"
        },
        grid: {
          // stroke: (t) => isMaxTick(t) ? "#A9B2B9" : "#CED7D6",
        }
      }}
    />

    <VictoryAxis
      dependentAxis
      label={"Upvote Score"}
      domain={[0,10]}
      tickFormat={(x) => x}
      style={{
        axisLabel: {
          fontSize: 18,
          padding: 30,
          fill: "#A9B2B9"
        },
        axis: {
          stroke: "#CED7D6"
        },
        ticks: {
          stroke: "#CED7D6"
        },
        tickLabels: {
          fontSize: 14,
          fill: "#CED7D6"
        },
        // grid: {
        //   stroke: "#CED7D6"
        // }
      }}
    />
    <VictoryLine
      data={myData.points} x="day" y="posts"
      interpolation="monotoneX"
      style={{
        data: {stroke: "#A9B2B9"}
      }}
    />
  </VictoryChart>
)
