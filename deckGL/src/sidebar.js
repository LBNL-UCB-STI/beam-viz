import React, {Component} from 'react';

import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

import SidebarCategoryLabel from './components/SidebarCategoryLabel';

import './sidebar.scss';


export default class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      categorizedData, toggleCategoryVisible,
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
          {categorizedData.map(categoryData =>
            categoryData.categoryName.toUpperCase() !== 'CHOICE'
            ? (<SidebarCategoryLabel
                key={categoryData.categoryName}
                className='sidebar--layers sidebar--input-group'
                categoryData={categoryData}
                onChangeCategoryColor={onChangeCategoryColor}
                toggleCategoryVisible={toggleCategoryVisible}
              />)
            : (
              <div key={categoryData.categoryName}>
                <SidebarCategoryLabel
                  className='sidebar--layers sidebar--input-group'
                  categoryData={{...categoryData, categoryName: 'CHOICE_HIGH'}}
                  onChangeCategoryColor={onChangeCategoryColor}
                  toggleCategoryVisible={toggleCategoryVisible}
                />
                <SidebarCategoryLabel
                  className='sidebar--layers sidebar--input-group'
                  categoryData={{...categoryData, categoryName: 'CHOICE_LOW'}}
                  onChangeCategoryColor={onChangeCategoryColor}
                  toggleCategoryVisible={toggleCategoryVisible}
                />
              </div>
            )
          )}
        </div>
      </div>
    );
  }
}
