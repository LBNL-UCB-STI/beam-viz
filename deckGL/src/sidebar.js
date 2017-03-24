import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

import ColorPicker from './components/color-picker';
import './sidebar.scss';


export default class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      tripsData, toggleCategoryVisible,
      isAnimating, setAnimating,
      loop, toggleLoop,
      trailLength, trailRange, onTrailLengthChange,
      currentTime, setCurrentTime,
      onChangeCategoryColor,
    } = this.props;
    return (
      <div id='sidebar'>
        <div className='sidebar--section'>
          <h4>Settings</h4>

          <div className='sidebar--input-group'>
            <label>Animation</label>
            <input type='button'
              onClick={() => setAnimating(!isAnimating)}
              value={isAnimating ? 'Pause' : 'Play'}
            />
          </div>

          <div className='sidebar--input-group'>
            <label htmlFor="loop">Play on loop</label>
            <input id="loop" type="checkbox"
              checked={loop}
              onChange={toggleLoop}
            />
          </div>

          <div className='sidebar--input-group'>
            <label>Amination Length</label>
            <InputRange tooltip={true} formatLabel={() => ''}
              value={currentTime} minValue={24000} maxValue={animationLength}
              onChange={setCurrentTime}
            />
          </div>

          <div className='sidebar--input-group'>
            <label>Trail length</label>
            <InputRange tooltip={true} formatLabel={() => ''}
              value={trailLength} minValue={trailRange.min} maxValue={trailRange.max}
              onChange={onTrailLengthChange}
            />
          </div>

        </div>

        <div className='sidebar--section'>
          <h4>Layers</h4>

          {tripsData.map(d =>
          <div key={d.category} className='sidebar--input-group'>
            <div style={{verticalAlign: 'middle'}}>
              <div style={{display: 'inline-block'}}>
              <ColorPicker
                categoryName={d.category}
                color={d.color}
                onChangeColor={(color) => onChangeCategoryColor(d.category, color)}
              />
              </div>
              <div className='category-label'>
                <label htmlFor={'chk-' + d.category}>
                  <span>{d.category}</span>
                </label>
              </div>
            </div>
            <input id={'chk-' + d.category} type="checkbox"
              checked={d.visible}
              onChange={() => toggleCategoryVisible(d.category)}
            />
          </div>
          )}

        </div>
      </div>
    );
  }
}
