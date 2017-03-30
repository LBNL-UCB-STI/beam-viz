import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import './clock.scss';

export default class Clock extends Component {

  _getHoursAngle(time) {
    const time_in_hours = time / (60 * 60);
    return time_in_hours * (360 / 12);
  }

  _getMinutesAngle(time) {
    const time_in_minutes = time / 60;
    return time_in_minutes * (360 / 60);
  }

  render() {
    const {time} = this.props;
    return (
      <div id='clock'>
        <div className='hours-container'>
          <div className='hours'
            style={{
              transform: 'rotateZ(' + this._getHoursAngle(time) + 'deg)',
              WebkitTransform: 'rotateZ(' + this._getHoursAngle(time) + 'deg)',
            }}
          />
        </div>
        <div className='minutes-container'>
          <div className='minutes'
            style={{
              transform: 'rotateZ(' + this._getMinutesAngle(time) + 'deg)',
            }}
          />
        </div>
      </div>
    );
  }
}
