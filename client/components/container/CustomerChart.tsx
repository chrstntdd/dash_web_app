import * as React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
const COLORS = ['#34495e', '#41aba0', '#0088FE', '#c0ffee', '#FF8042'];

interface PropTypes {}
interface StateType {
  activeIndex: number;
  height: number;
  width: number;
}

const renderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 11}
        y={ey}
        fontSize={window.innerWidth < 450 ? 12 : 16}
        textAnchor={textAnchor}
        fill="black"
      >{`${value} Sales`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        fontSize={window.innerWidth < 450 ? 10 : 12}
        dy={18}
        textAnchor={textAnchor}
        fill="black"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default class CustomerChart extends React.PureComponent<
  PropTypes,
  StateType
> {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    };
  }

  componentDidMount() {
    const width = document.getElementById('customer-chart-wrapper').clientWidth;
    const height = document.getElementById('customer-chart-wrapper')
      .clientHeight;
    this.setState({ width, height });
  }

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index
    });
  };

  render() {
    return (
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={this.props.data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={window.innerWidth < 450 ? 30 : 40}
            outerRadius={window.innerWidth < 450 ? 65 : 75}
            fill="#8884d8"
            onMouseEnter={this.onPieEnter}
          >
            {this.props.data.map((entry, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
