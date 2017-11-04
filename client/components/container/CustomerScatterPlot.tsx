import * as React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 }
];

interface PropTypes {}
interface StateType {}

export default class CustomerScatterPlot extends React.Component<
  PropTypes,
  StateType
> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const width = document.getElementById('customer-scatter-wrapper')
      .clientWidth;
    const height = document.getElementById('customer-scatter-wrapper')
      .clientHeight;
    this.setState({ width, height });
  }
  render() {
    return (
      <ScatterChart
        width={this.state.width}
        height={this.state.height}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <XAxis dataKey={'x'} name="stature" unit="cm" type="number" />
        <YAxis dataKey={'y'} name="weight" unit="kg" />
        <CartesianGrid />
        <Scatter name="A school" data={data} fill="#8884d8" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      </ScatterChart>
    );
  }
}
