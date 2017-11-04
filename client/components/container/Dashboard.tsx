import * as React from 'react';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import * as faker from 'faker';

import CustomerChart from './CustomerChart';
import CustomerGraph from './CustomerGraph';
import TimeSelect from '../stateless/TimeSelect';
import Priority from '../stateless/Priority';

import '../../styles/dashboard.scss';
import * as hamburger from '../../assets/img/hamburger-menu.svg';
import KSUicon from '../../assets/img/ksu.jpg';

enum Business {
  Busy = 'busy',
  Normal = 'normal',
  Slow = 'slow'
}

export interface PriorityData {
  title: string;
  data: number | string;
  delta: number | string;
}

const currentVisitors: PriorityData = {
  title: 'Current Visitors',
  data: 35,
  delta: 15
};
const currentWaitTime: PriorityData = {
  title: 'Active Wait Time',
  data: 12,
  delta: -4
};
const currentPeopleInLine: PriorityData = {
  title: 'People In Line',
  data: 5,
  delta: 3
};
const averageWaitLastHour: PriorityData = {
  title: 'Wait Time',
  data: 13,
  delta: 1
};
const salesLastHour: PriorityData = {
  title: 'Sales Today',
  data: 56,
  delta: -5
};

interface PropTypes {}
interface StateType {
  isNavOpen: boolean;
  hours: [string];
  priorityData: [PriorityData];
  time: string;
  data: [ChartData];
}

interface ChartData {
  name: string;
  uv: number;
  pv: number;
}

const genFakeData = (name: string): ChartData => ({
  name,
  uv: faker.random.number({ min: 50, max: 250 }),
  pv: faker.random.number({ min: 50, max: 250 })
});

export default class Dashboard extends React.Component<PropTypes, StateType> {
  constructor(props) {
    super(props);
    this.state = {
      isNavOpen: false,
      time: moment()
        .clone()
        .toLocaleString(),
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
      data: []
    };
    this.displayTime = this.displayTime.bind(this);
  }
  interval;
  initLength;

  componentDidMount() {
    const times = [
      '8:00 AM',
      '9:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM'
    ];
    this.initLength = this.state.data.length;
    this.interval = setInterval(() => this.displayTime(), 1000);
    this.setState({
      data: times.map((time, i) => genFakeData(time))
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  displayTime = () => {
    this.setState({
      time: moment()
        .clone()
        .toLocaleString()
    });
  };

  updateData = () => {
    const newData = genFakeData('5:00 PM');
    this.setState({
      data: [...this.state.data, newData]
    });
  };

  handleClick = () => {
    this.setState({ isNavOpen: !this.state.isNavOpen });
    this.forceUpdate();
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
            <img src={KSUicon} alt="KSU logo" />
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
            <h3>{this.state.time}</h3>
            <Link to="/">Logout</Link>
          </header>
          <section id="widget-wrapper">
            <div id="priority-stats">
              {this.state.priorityData.map((value, i) => {
                return (
                  <Priority
                    key={i}
                    title={value.title}
                    data={value.data}
                    delta={value.delta}
                  />
                );
              })}
            </div>
            <div id="customer-graph-wrapper">
              <button onClick={this.updateData}>UPDATE</button>
              <CustomerGraph data={this.state.data} />
            </div>
            <div id="customer-chart-wrapper">
              <CustomerChart />
            </div>
            <div className="cuck" />
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
