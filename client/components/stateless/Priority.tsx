import * as React from 'react';
import { PriorityData } from '../container/Dashboard';
import '../../styles/priority.scss';

const Priority = ({ title, data, delta }) => {
  let deltaVal;
  if (delta == 0) {
    deltaVal = (
      <p className="delta">
        <span>{delta}</span> from last week
      </p>
    );
  } else if (delta > 0) {
    deltaVal = (
      <p className="delta">
        <i className="fa fa-caret-up pos" aria-hidden="true" />{' '}
        <span className="pos">{delta}</span> from last week
      </p>
    );
  } else {
    deltaVal = (
      <p className="delta">
        <i className="fa fa-caret-down neg" aria-hidden="true" />{' '}
        <span className="neg">{delta}</span> from last week
      </p>
    );
  }
  return (
    <div className="priority">
      <h4 className="title">{title}</h4>
      <h2 className="data">{data}</h2>
      {deltaVal}
    </div>
  );
};

export default Priority;
