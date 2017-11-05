import * as React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
interface PropTypes {
  data: [];
}
interface StateType {
  height: number;
  width: number;
  margin: number;
}

export default class CustomerGraph extends React.PureComponent<
  PropTypes,
  StateType
> {
  constructor(props) {
    super(props);
    this.state = {
      height: 400,
      width: 300,
      margin: 5
    };
  }

  componentDidMount() {
    const d = document;

    const height = d.getElementById('customer-graph-wrapper').clientHeight;
    const width = d.getElementById('customer-graph-wrapper').clientWidth;

    this.setState({ width, height });
  }

  render() {
    return (
      <ResponsiveContainer height={this.state.height} width="100%">
        <AreaChart
          key={Math.random()}
          data={this.props.data}
          margin={{
            top: this.state.margin,
            right: 40,
            left: this.state.margin,
            bottom: 40
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            label={{ value: 'Today', position: 'bottom' }}
            dataKey="hour"
          />
          <YAxis
            label={{ value: 'Customers', position: 'left', angle: -90, dx: 30 }}
          />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Area type="monotone" dataKey="Customers" stroke="'#34495e'" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}
