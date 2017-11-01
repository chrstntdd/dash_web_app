import * as React from 'react';
import Navigation from '../stateless/Navigation';
import '../../styles/landing-page.scss';

interface PropTypes {}
interface StateType {}

export default class LandingPage extends React.Component<PropTypes, StateType> {
  render() {
    return (
      <main id="landing-page">
        <Navigation />
        <div id="hero-text">
          <h1>Dash Analytics</h1>
          <h3>
            Discover, Track, and Anticipate your in-store customer behavior
          </h3>
        </div>
        <button>Learn More</button>
      </main>
    );
  }
}
