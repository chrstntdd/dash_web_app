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
    this.state = {};
  }
  /* this variable is to ensure the component doesn't re-render unless it has to. */
  initDataLength: number;

  shouldComponentUpdate(props) {
    /* only update when new data is passed in */
    return props.data.length > this.initDataLength;
  }

  componentDidMount() {
    const width = document.getElementById('customer-graph-wrapper').clientWidth;
    this.setState({ width });
  }

  render() {
    this.initDataLength = this.props.data.length;
    return (
      <LineChart
        key={Math.random()}
        width={this.state.width}
        height={350}
        data={this.props.data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis label="time" dataKey="name" />
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
