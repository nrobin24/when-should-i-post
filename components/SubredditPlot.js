import { VictoryBar, VictoryChart, VictoryAxis, VictoryLine, VictoryTheme } from 'victory'

const myData = [
  {day: 1, posts: 4},
  {day: 2, posts: 7},
  {day: 3, posts: 9},
  {day: 4, posts: 2},
  {day: 5, posts: 2},
  {day: 6, posts: 5},
  {day: 7, posts: 3},
]

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
    />

    <VictoryAxis
      dependentAxis
      domain={[0,10]}
      tickFormat={(x) => x}
    />
    <VictoryLine
      data={myData} x="day" y="posts"
      interpolation="natural"
    />
  </VictoryChart>
)
