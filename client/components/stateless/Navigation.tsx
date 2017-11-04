import * as React from 'react';
import { Link } from 'react-router-dom';

import '../../styles/navigation.scss';
import * as logo from '../../assets/img/dash-d.svg';

const Navigation = () => (
  <nav id="home-nav">
    <img src={logo} alt="" />
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
    </ul>
  </nav>
);

export default Navigation;
