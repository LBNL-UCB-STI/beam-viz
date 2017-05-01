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
      height,
      categorizedData, toggleCategoryVisible,
      isAnimating, setAnimating,
      loop, toggleLoop,
      trailLength, trailRange, onTrailLengthChange,
      currentTime, setCurrentTime,
      animationSpeed, animationSpeedRange, onAnimationSpeedChange,
      animationBounds,
      onChangeCategoryColor,
      mapStyle, mapStyleOptions, setMapStyle,
      allCategoriesVisible, toggleAllCategoriesVisibility,
      goto, onGoto, onGotoChange,
      jump, onJumpChange, onJumpForward, onJumpBackward,
      autoMovement, toggleAutoMovement,
      autoRotateSpeed, onAutoRotateSpeedChange,
      autoZoomSpeed, onAutoZoomSpeedChange,
      autoPitchSpeed, onAutoPitchSpeedChange, 
      autoLatSpeed, onAutoLatSpeedChange,
      autoLonSpeed, onAutoLonSpeedChange
    } = this.props;
    return (
      <div id='sidebar' style={{height: height}}>
        <div className='sidebar--section'>
          <h4>Settings</h4>

          <div className='sidebar--input-group two'>
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

          <div className='sidebar--input-group two'>
            <label>Animation</label>
            <input type='button'
              onClick={() => setAnimating(!isAnimating, true)}
              value={isAnimating ? 'Pause' : 'Play'}
            />
          </div>

          <div className='sidebar--input-group two'>
            <label htmlFor="loop">Play on loop</label>
            <input id="loop" type="checkbox"
              checked={loop}
              onChange={toggleLoop}
            />
          </div>

          <div className='sidebar--input-group two'>
            <label>Animation speed</label>
            <InputRange
              formatLabel={() => ''}
              minValue={animationSpeedRange.min}
              maxValue={animationSpeedRange.max}
              value={animationSpeed}
              onChange={onAnimationSpeedChange}
            />
          </div>

          <div className='sidebar--input-group two'>
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

          <div className='sidebar--input-group two'>
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
          <div className='sidebar--layers sidebar--input-group'>
            <div className='layer--description all-categories'>
              <label htmlFor='chk-all-categories'>Show all</label>
            </div>
            <div className='chk-category'>
              <input id='chk-all-categories' type="checkbox"
                checked={allCategoriesVisible}
                onChange={toggleAllCategoriesVisibility}
              />
            </div>
          </div>
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
        <div className='sidebar--section'>
          <div className='sidebar--input-group three'>
              <label className="goto_label" htmlFor="goto">Goto</label>
              <span><input type="number" id="goto" value={goto} onChange={e => onGotoChange(e.target.value)} className="cbtn framesize" /></span>
              <span><button type="button" onClick={onGoto} className="sbtn">Jump</button></span>
          </div>
          <div className='sidebar--input-group three'>
              <label className="framesize_label" htmlFor="jump">Frame size</label>
              <span><input type="number" id="jump" value={jump} onChange={e => onJumpChange(e.target.value)} className="framesize" /></span>
              <span>
                <button type="button" onClick={onJumpForward} className="sbtn"> &gt;</button>
                <button type="button" onClick={onJumpBackward} className="sbtn"> &lt;</button>
              </span>
          </div>
          <div className='sidebar--input-group two'>
            <label htmlFor="autoMovement">Move View</label>
            <input id="autoMovement" type="checkbox"
              checked={autoMovement}
              onChange={toggleAutoMovement}
            />
          </div>
          <div className='sidebar--input-group three'>
              <label className="autoRotateSpeed_label" htmlFor="autoRotateSpeed">Rotate</label>
              <span><input type="number" id="autoRotateSpeed" value={autoRotateSpeed} onChange={e => onAutoRotateSpeedChange(e.target.value)} className="cbtn framesize" /></span>
          </div>
          <div className='sidebar--input-group three'>
              <label className="autoZoomSpeed_label" htmlFor="autoZoomSpeed">Zoom</label>
              <span><input type="number" id="autoZoomSpeed" value={autoZoomSpeed} onChange={e => onAutoZoomSpeedChange(e.target.value)} className="cbtn framesize" /></span>
          </div>
          <div className='sidebar--input-group three'>
              <label className="autoPitchSpeed_label" htmlFor="autoPitchSpeed">Pitch</label>
              <span><input type="number" id="autoPitchSpeed" value={autoPitchSpeed} onChange={e => onAutoPitchSpeedChange(e.target.value)} className="cbtn framesize" /></span>
          </div>
          <div className='sidebar--input-group three'>
              <label className="autoLatSpeed_label" htmlFor="autoLatSpeed">Lat</label>
              <span><input type="number" id="autoLatSpeed" value={autoLatSpeed} onChange={e => onAutoLatSpeedChange(e.target.value)} className="cbtn framesize" /></span>
          </div>
          <div className='sidebar--input-group three'>
              <label className="autoLonSpeed_label" htmlFor="autoLonSpeed">Lon</label>
              <span><input type="number" id="autoLonSpeed" value={autoLonSpeed} onChange={e => onAutoLonSpeedChange(e.target.value)} className="cbtn framesize" /></span>
          </div>
        </div>
      </div>
    );
  }
}
