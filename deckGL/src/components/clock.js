import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import './clock.scss';

export default class Clock extends Component {

  _getHoursAngle(time) {
    return (time / (12 * 60)) * 360;
  }

  _getMinutesAngle(time) {
    return (time / 60) * 360;
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
