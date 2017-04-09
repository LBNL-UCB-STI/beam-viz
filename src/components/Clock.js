/*
 * A stateless css-clock component
 * Props: time (in seconds)
 */

import React from 'react';

import './Clock.scss';

const getHoursAngle = (time_in_seconds) => {
  const time_in_hours = time_in_seconds / (60 * 60);
  return time_in_hours * (360 / 12);
}

const getMinutesAngle = (time_in_seconds) => {
  const time_in_minutes = time_in_seconds / 60;
  return time_in_minutes * (360 / 60);
}

const Clock = ({ time }) => (
  <div id='clock'>
    <div className='hours-container'>
      <div className='hours'
        style={{
          transform: 'rotateZ(' + getHoursAngle(time) + 'deg)',
          WebkitTransform: 'rotateZ(' + getHoursAngle(time) + 'deg)',
        }}
      />
    </div>
    <div className='minutes-container'>
      <div className='minutes'
        style={{
          transform: 'rotateZ(' + getMinutesAngle(time) + 'deg)',
        }}
      />
    </div>
    <div className='twstyle'>{parseInt(time)}</div>
  </div>
);


export default Clock;
