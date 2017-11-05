import * as React from 'react';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import * as faker from 'faker';
import {
  dailyCustomers,
  salesAndVisits,
  genScatterData
} from '../../util/genFakeData';

import CustomerScatterPlot from './CustomerScatterPlot';
import CustomerChart from './CustomerChart';
import CustomerGraph from './CustomerGraph';
import TimeSelect from '../stateless/TimeSelect';
import Priority from '../stateless/Priority';

import '../../styles/dashboard.scss';
import * as hamburger from '../../assets/img/hamburger-menu.svg';
import * as dashLogo from '../../assets/img/dash-d.svg';
import KSUIcon from '../../assets/img/ksu.jpg';

enum Business {
  Busy = 'busy',
  Normal = 'normal',
  Slow = 'slow'
}

/* Time will be in ms */
enum PriorityType {
  Int = 'number',
  Time = 'time'
}

export interface PriorityData {
  title: string;
  type: PriorityType;
  data: number | string;
  delta: number | string;
}

const currentVisitors: PriorityData = {
  title: 'Visitors',
  type: PriorityType.Int,
  data: 35,
  delta: 15
};
const currentWaitTime: PriorityData = {
  title: 'Wait Time',
  type: PriorityType.Time,
  data: 433276000,
  delta: 413244
};
const currentPeopleInLine: PriorityData = {
  title: 'People In Line',
  type: PriorityType.Int,
  data: 5,
  delta: 3
};
const averageWaitLastHour: PriorityData = {
  title: 'Avg. Wait Time',
  type: PriorityType.Time,
  data: 33276000,
  delta: 433276000
};
const salesLastHour: PriorityData = {
  title: 'Sales',
  type: PriorityType.Int,
  data: 56,
  delta: 0
};

interface PropTypes {}
interface StateType {
  isNavOpen: boolean;
  hours: [string];
  priorityData: [PriorityData];
  time: string;
  data: [ChartData];
  donutData: [];
}

interface ChartData {
  name: string;
  uv: number;
  pv: number;
}

export default class Dashboard extends React.Component<PropTypes, StateType> {
  constructor(props) {
    super(props);
    this.state = {
      isNavOpen: false,
      time: moment().format('LLLL'),
      hours: [
        '8:00 AM',
        '9:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '1:00 PM',
        '2:00 PM',
        '3:00 PM',
        '4:00 PM',
        '5:00 PM'
      ],
      priorityData: [
        currentVisitors,
        currentPeopleInLine,
        currentWaitTime,
        averageWaitLastHour,
        salesLastHour
      ],
      data: [],
      donutData: [],
      scatterData: [
        { x: 100, y: 200, z: 100 },
        { x: 100, y: 100, z: 100 },
        { x: 170, y: 300, z: 100 },
        { x: 140, y: 250, z: 100 },
        { x: 150, y: 400, z: 100 },
        { x: 110, y: 280, z: 100 }
      ]
    };
    this.displayTime = this.displayTime.bind(this);
  }
  interval;
  initLength;

  componentDidMount() {
    console.log(genScatterData(10));
    const fakeData = dailyCustomers();
    const fakeDonutData = salesAndVisits();
    this.initLength = this.state.data.length;
    this.interval = setInterval(() => this.displayTime(), 1000);
    this.setState({
      data: fakeData,
      donutData: fakeDonutData
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    window.removeEventListener('resize', this.handleResize);
  }

  displayTime = () => {
    this.setState({
      time: moment().format('LLLL')
    });
  };

  handleClick = () => {
    this.setState({ isNavOpen: !this.state.isNavOpen });
  };

  handleSelect(e) {
    console.log((e.target || e.srcElement).value);
  }

  render() {
    const button = (
      <button
        id="side-menu-button"
        onClick={this.handleClick}
        className={this.state.isNavOpen === true ? 'open' : ''}
      >
        <img
          src={hamburger}
          className={
            this.state.isNavOpen === true ? 'ham-menu open' : 'ham-menu closed'
          }
        />
      </button>
    );

    return (
      <main id="dashboard-wrapper">
        <aside className={this.state.isNavOpen === true ? 'show' : ''}>
          <h4>Kennesaw State University</h4>
          <div id="site-logo">
            <img src={KSUIcon} alt="KSU logo" />
          </div>
          <nav id="dashboard-nav">
            <ul>
              <li>Link1</li>
              <li>Link2</li>
              <li>Link3</li>
              <li>Link4</li>
              <li>Link5</li>
            </ul>
          </nav>
        </aside>
        {this.state.isNavOpen && (
          <div className="overlay" onClick={this.handleClick} />
        )}
        {button}
        <div
          id="main-dashboard-container"
          className={this.state.isNavOpen === true ? 'open' : ''}
        >
          <header>
            <img src={dashLogo} />
            <Link to="/">Logout</Link>
          </header>
          <section id="widget-wrapper">
            <div id="time-container">
              <h3>{this.state.time}</h3>
            </div>
            <div id="priority-stats">
              {this.state.priorityData.map((value, i) => {
                return (
                  <Priority
                    key={i}
                    title={value.title}
                    data={value.data}
                    delta={value.delta}
                    type={value.type}
                  />
                );
              })}
            </div>
            <div id="customer-graph-wrapper">
              <CustomerGraph data={this.state.data} />
            </div>
            <div id="customer-chart-wrapper">
              <CustomerChart data={this.state.donutData} />
            </div>
            <div id="customer-scatter-wrapper">
              <CustomerScatterPlot data={this.state.scatterData} />
            </div>
            <div className="cuck" />
          </section>

          <TimeSelect
            hours={this.state.hours}
            handleSelect={this.handleSelect}
          />
        </div>
      </main>
    );
  }
}
