import * as React from 'react';

interface PropTypes {
  hours: [string];
  handleSelect(e);
}

const TimeSelect: React.SFC<PropTypes> = ({ hours, handleSelect }) => {
  return (
    <select onChange={e => handleSelect(e)}>
      {hours.map((hour, i) => {
        return (
          <option value={hour} key={i}>
            {hour}
          </option>
        );
      })}
    </select>
  );
};
export default TimeSelect;
