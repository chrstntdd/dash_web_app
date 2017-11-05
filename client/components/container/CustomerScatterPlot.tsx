import * as React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface PropTypes {
  data: [
    {
      x: number;
      y: number;
      z: number;
    }
  ];
}
interface StateType {
  height: number;
  width: number;
}

export default class CustomerScatterPlot extends React.PureComponent<
  PropTypes,
  StateType
> {
  constructor(props) {
    super(props);
    this.state = {
      width: 400,
      height: 300
    };
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
      <ResponsiveContainer height={this.state.height} width="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis dataKey={'x'} name="stature" unit="cm" type="number" />
          <YAxis dataKey={'y'} name="weight" unit="kg" />
          <CartesianGrid />
          <Scatter name="A school" data={this.props.data} fill="#8884d8" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }
}
