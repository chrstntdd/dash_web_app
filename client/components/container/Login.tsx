import * as React from 'react';
import { Redirect } from 'react-router-dom';

import '../../styles/login.scss';

interface PropTypes {
  history: [string];
}
interface StateType {}

export default class Login extends React.Component<PropTypes, StateType> {
  navToDash(e) {
    e.preventDefault();
    this.props.history.push('/dashboard');
  }
  render() {
    return (
      <main id="login-page">
        <div id="login-card" className="show">
          <h4>Sign in to your account</h4>
          <form onSubmit={e => this.navToDash(e)}>
            <input
              type="email"
              required
              autoComplete="off"
              placeholder="Email"
            />
            <input
              type="password"
              required
              autoComplete="off"
              placeholder="Password"
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </main>
    );
  }
}
