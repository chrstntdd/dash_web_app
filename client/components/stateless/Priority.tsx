import * as React from 'react';
import { PriorityData } from '../container/Dashboard';
import '../../styles/priority.scss';
import { duration } from 'moment';

const getTime = (data: number) => {
  return `${duration(data).minutes()}m ${duration(data).seconds()}s`;
};

const Priority = ({ title, data, delta, type }) => {
  let deltaVal;
  if (delta == 0) {
    deltaVal = (
      <p className="delta">
        <i className="fa fa-caret-right neutral" aria-hidden="true" />{' '}
        <span className="neutral">{delta}%</span> from last week
      </p>
    );
  } else if (delta > 0) {
    if (type == 'time') {
      deltaVal = (
        <p className="delta">
          <i className="fa fa-caret-down pos" aria-hidden="true" />{' '}
          <span className="pos">{getTime(delta)}</span> from last week
        </p>
      );
    } else {
      deltaVal = (
        <p className="delta">
          <i className="fa fa-caret-up pos" aria-hidden="true" />{' '}
          <span className="pos">{delta}%</span> from last week
        </p>
      );
    }
  } else {
    if (type === 'time') {
      deltaVal = (
        <p className="delta">
          <i className="fa fa-caret-up neg" aria-hidden="true" />{' '}
          <span className="neg">{getTime(delta)}</span> from last week
        </p>
      );
    }
    deltaVal = (
      <p className="delta">
        <i className="fa fa-caret-down neg" aria-hidden="true" />{' '}
        <span className="neg">{delta}%</span> from last week
      </p>
    );
  }
  return (
    <div className="priority">
      <h4 className="title">{title}</h4>
      {type === 'time' ? (
        <h2 className="data">{getTime(data)}</h2>
      ) : (
        <h2 className="data">{data}</h2>
      )}
      {deltaVal}
    </div>
  );
};

export default Priority;
