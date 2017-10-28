import * as React from 'react';

interface PropTypes {}
interface StateType {}

export default class NotFound extends React.Component<PropTypes, StateType> {
  render() {
    return (
      <section>
        <h1>404 NOT FOUND</h1>
      </section>
    );
  }
}
