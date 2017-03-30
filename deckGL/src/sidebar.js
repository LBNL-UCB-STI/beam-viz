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
      animationSpeed, animationSpeedRange, onAnimationSpeedChange,
      animationBounds,
      onChangeCategoryColor,
      mapStyle, mapStyleOptions, setMapStyle,
    } = this.props;
    return (
      <div id='sidebar'>
        <div className='sidebar--section'>
          <h4>Settings</h4>

          <div className='sidebar--input-group'>
            <label>Map style</label>
            <select value={mapStyle.style}
              onChange={e => setMapStyle(e.target.value)}
            >
              {mapStyleOptions.map(ms => {
                return (
                  <option key={ms.style} value={ms.style}>{ms.style}</option>
                );
              })}
            </select>
          </div>

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
            <label>Animation speed</label>
            <InputRange
              formatLabel={() => ''}
              minValue={animationSpeedRange.min}
              maxValue={animationSpeedRange.max}
              value={animationSpeed}
              onChange={onAnimationSpeedChange}
            />
          </div>

          <div className='sidebar--input-group'>
            <label>Time elapsed</label>
            <InputRange
              formatLabel={() => ''}
              minValue={animationBounds.startTime}
              maxValue={animationBounds.endTime}
              step={(animationBounds.endTime - animationBounds.startTime) / 100}
              value={currentTime}
              onChange={setCurrentTime}
            />
          </div>

          <div className='sidebar--input-group'>
            <label>Trail length</label>
            <InputRange
              formatLabel={() => ''}
              minValue={trailRange.min}
              maxValue={trailRange.max}
              value={trailLength}
              onChange={onTrailLengthChange}
            />
          </div>

        </div>

        <div className='sidebar--section'>
          <h4>Layers</h4>

          {tripsData.map(d =>
          <div key={d.categoryName} className='sidebar--layers sidebar--input-group'>
            <div className='layer--description'>
              <div style={{display: 'inline-block'}}>
              <ColorPicker
                categoryName={d.categoryName}
                color={d.color}
                onChangeColor={(color) => onChangeCategoryColor(d.categoryName, color)}
              />
              </div>
              <div className='category-label'>
                <label htmlFor={'chk-' + d.categoryName}>
                  <span>{d.categoryName}</span>
                </label>
              </div>
            </div>
            <div className='chk-category'>
              <input id={'chk-' + d.categoryName} type="checkbox"
                checked={d.visible}
                onChange={() => toggleCategoryVisible(d.categoryName)}
              />
            </div>
          </div>
          )}

        </div>
      </div>
    );
  }
}
