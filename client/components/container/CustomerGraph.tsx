import * as React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
interface PropTypes {
  data: [];
}
interface StateType {}

export default class CustomerGraph extends React.Component<
  PropTypes,
  StateType
> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LineChart
        key={Math.random()}
        width={730}
        height={350}
        data={this.props.data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis label="name" dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          isAnimationActive={false}
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
        />
        <Line
          isAnimationActive={false}
          type="monotone"
          dataKey="uv"
          stroke="#82ca9d"
        />
      </LineChart>
    );
  }
}
