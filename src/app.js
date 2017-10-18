import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MapboxGLMap from './mapgl.js';
import autoBind from 'react-autobind';

import './app.scss';

import {MAP_STYLES, REFRESH_INTERVAL} from './constants';
import BeamDeckGL from './BeamDeckGL';
import Sidebar from './sidebar';
import Clock from './components/Clock';
import {getCategorizedLayers, setCategoryColor, toggleCategoryVisible} from './category-manager';

var data = require('raw-loader!./trips.json');

const document_height = () => {
  const html = document.documentElement;
  const body = document.body;
  return Math.max(
    body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight
  )
}


class App extends Component {
  constructor(props) {
    super(props);
    var rawData =  data.replace(/module.exports =/i, ' ')
    var jsonData = JSON.parse(rawData);
    
     
    const categorizedData = getCategorizedLayers(jsonData);
    this.state = {
      width: window.innerWidth,
      height: document_height(),
      categorizedData: categorizedData,
      mapViewState: {
	latitude: 37.72785803280886,
	longitude: -122.38169756795798,
	zoom: 11.42,
	pitch: 60,
	bearing: 30
	  /*latitude: 37.7,*/
	  /*longitude: -122.22,*/
	  /*zoom: 13,*/
	  /*pitch: 60,*/
	  /*bearing: 40*/
      },
      isAnimating: true,
      animationSpeed: 200,        // 1 second in the animation, represents 200 seconds in real life
      loop: true,
      trailLength: 250,
      currentTime: categorizedData[0].startTime,
      mapStyle: MAP_STYLES[5],
      allCategoriesVisible: true,
      goto: 0,
      jump: 60,
      autoMovement: false,
      /*autoRotateSpeed: 0.0,    // degrees per second*/
      /*autoZoomSpeed: 0.0,      // levels per second*/
      /*autoPitchSpeed: 0.0,     // degrees per second*/
      /*autoLatSpeed: 0.000,      // degrees per second*/
      /*autoLonSpeed: 0.000,     // degrees per second*/
      autoRotateSpeed: -0.5,
      autoZoomSpeed: -0.09, 
      autoPitchSpeed: -1.0, 
      autoLatSpeed: -0.001, 
      autoLonSpeed: 0.0,
    }

    this._trailRange = {
      min: 10,
      max: 1000
    };
    this._animationSpeedRange = {
      min: 10,
      max: 500
    };
    this._allCategoriesHidden = false;
    this._userPaused = false;    // when animation is stopped due to all categories being hidden

    autoBind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize);
    /*this._autoMovement();*/
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
    /*clearInterval(this._autoMovement);*/
  }

  _onResize() {
    this.setState({
      width: window.innerWidth,
      height: document_height(),
    });
  }

  _onChangeViewport(mapViewState) {
    if (mapViewState.pitch > 60) {
      mapViewState.pitch = 60;
    }
    if (mapViewState.bearing < 0) {
      mapViewState.bearing = mapViewState.bearing + 360;
    }
    if (mapViewState.bearing > 360) {
      mapViewState.bearing = mapViewState.bearing - 360;
    }
    this.setState({mapViewState});
  }

  _autoMovement() {
    // Zoom
    this._autoMovementInterval = setInterval(() => {
      if(this.state.autoMovement){
	let zoom = this.state.mapViewState.zoom;
	zoom += REFRESH_INTERVAL / 1000 * this.state.autoZoomSpeed;
	let bearing = this.state.mapViewState.bearing;
	bearing += REFRESH_INTERVAL / 1000 * this.state.autoRotateSpeed;
	let pitch = this.state.mapViewState.pitch;
	pitch += REFRESH_INTERVAL / 1000 * this.state.autoPitchSpeed;
	let latitude = this.state.mapViewState.latitude;
	latitude += REFRESH_INTERVAL / 1000 * this.state.autoLatSpeed;
	let longitude = this.state.mapViewState.longitude;
	longitude += REFRESH_INTERVAL / 1000 * this.state.autoLonSpeed;
	this.setState({
	  mapViewState: {
	    latitude: latitude,
	    longitude: longitude,
	    zoom: zoom,
	    pitch: pitch,
	    bearing: bearing
	}});
      }
    })
  }

  _setAnimating(isAnimating, userPaused) {
    if (isAnimating && this._allCategoriesHidden) return;
    this.setState({isAnimating});
    this._userPaused = userPaused;
  }

  _toggleAutoMovement() {
    this.setState({autoMovement: !this.state.autoMovement});
  }
  _toggleLoop() {
    this.setState({loop: !this.state.loop});
  }

  _toggleCategoryVisible(categoryName) {
    const categorizedData = toggleCategoryVisible(this.state.categorizedData, categoryName);

    const categoryVisibility = categorizedData.map(categoryData => categoryData.visible);
    const allCategoriesVisible = categoryVisibility.reduce((v1, v2) => v1 && v2);
    this._allCategoriesHidden = !categoryVisibility.reduce((v1, v2) => v1 || v2);
    if (this._allCategoriesHidden) {
      this._setAnimating(false, false);
    }

    this.setState({
      categorizedData,
      allCategoriesVisible,
    });
    if (!this._allCategoriesHidden && !this.state.isAnimating && !this._userPaused) {
      this._setAnimating(true);
    }
  }

  _toggleAllCategoriesVisibility(categoryName) {
    const visible = !this.state.allCategoriesVisible;
    const categorizedData = this.state.categorizedData.map(
      categoryData => ({...categoryData, visible}),
    );

    this._allCategoriesHidden = !visible;
    if (!visible) {
      if (this.state.isAnimating) {
        this._setAnimating(false, false);
      }
    }

    this.setState({
      allCategoriesVisible: visible,
      categorizedData,
    });
    if (visible && !this.state.isAnimating && !this._userPaused) {
      this._setAnimating(true);
    }
  }

  _onTrailLengthChange(trailLength) {
    this.setState({trailLength});
  }

  _onChangeCategoryColor(categoryName, color) {
    this.setState({
      categorizedData: setCategoryColor(this.state.categorizedData, categoryName, color),
    });
  }

   _setCurrentTime(currentTime) {
      this.setState({currentTime});
  }

  _getAnimationTimeBounds(categorizedData) {
    let visibleCategories = categorizedData.filter(categoryData => categoryData.visible);
    if (visibleCategories.length === 0) {
      visibleCategories = categorizedData;   // else startTime and endTime will be Infinity and -Infinity
    }
    /*const startTime = Math.min.apply(null, visibleCategories.map(categoryData => categoryData.startTime));*/
    /*const endTime = Math.max.apply(null, visibleCategories.map(categoryData => categoryData.endTime));*/
    const startTime = 26000
    const endTime = 31000
    return {
      startTime,
      endTime,
    };
  }

  _setMapStyle(style) {
    const mapStyle = MAP_STYLES.filter(ms => ms.style == style)[0];
    this.setState({mapStyle});
  }

  _onAnimationSpeedChange(animationSpeed) {
    this.setState({animationSpeed});
  }

  _onGotoChange(goto) {
    this.setState({
      goto: parseInt(goto)
    });
  }

  _onGoto() {
    const goto = parseInt(this.state.goto);
    const bounds = this._getAnimationTimeBounds(this.state.categorizedData);
    if (goto < bounds.startTime) return this._setCurrentTime(bounds.startTime);
    if (goto > bounds.endTime ) return this._setCurrentTime(bounds.endTime);
    return this._setCurrentTime(goto);
  }

  _onJumpChange(jump) {
    this.setState({
      jump: parseInt(jump)
    });
  }

  _onJump(direction) {
    const jump = this.state.jump;
    const time = this.state.currentTime + (direction == 'f' ? jump : -jump);
    const bounds = this._getAnimationTimeBounds(this.state.categorizedData);
    if (time < bounds.startTime) return this._setCurrentTime(bounds.startTime);
    if (time > bounds.endTime ) return this._setCurrentTime(bounds.endTime);
    this._setCurrentTime(time);
  }

  _onJumpForward() {
    this._onJump('f');
  }

  _onJumpBackward() {
    this._onJump('b');
  }

  _onAutoRotateSpeedChange(autoRotateSpeed) {
    this.setState({
      autoRotateSpeed: autoRotateSpeed
    });
  }
  _onAutoZoomSpeedChange(autoZoomSpeed) {
    this.setState({
      autoZoomSpeed: autoZoomSpeed
    });
  }
  _onAutoPitchSpeedChange(autoPitchSpeed) {
    this.setState({
      autoPitchSpeed: autoPitchSpeed
    });
  }
  _onAutoLatSpeedChange(autoLatSpeed) {
    this.setState({
      autoLatSpeed: autoLatSpeed
    });
  }
  _onAutoLonSpeedChange(autoLonSpeed) {
    this.setState({
      autoLonSpeed: autoLonSpeed
    });
  }
  _onBearingChange(bearing) {
    this.setState({
      mapViewState: {bearing: bearing},
    });
  }
  _onZoomChange(zoom) {
    this.setState({
      mapViewState: {zoom: zoom},
    });
  }
  _onPitchChange(pitch) {
    this.setState({
      mapViewState: {pitch: pitch},
    });
  }
  _onLatChange(latitude) {
    this.setState({
      mapViewState: {latitude: latitude},
    });
  }
  _onLonChange(longitude) {
    this.setState({
      mapViewState: {longitude: longitude},
    });
  }

  render() {
    const animationBounds = this._getAnimationTimeBounds(this.state.categorizedData);
    return (
      <div>
        <MapboxGLMap
          mapStyle={this.state.mapStyle.url}
          mapboxApiAccessToken={this.state.mapStyle.accessToken}
          {...this.state.mapViewState}
          width={this.state.width} height={this.state.height}
          perspectiveEnabled
          onChangeViewport={this._onChangeViewport}
        >
          <BeamDeckGL
            mapViewState={this.state.mapViewState}
            categorizedData={this.state.categorizedData}
            width={this.state.width} height={this.state.height}
            isAnimating={this.state.isAnimating}
            setAnimating={this._setAnimating}
            animationSpeed={this.state.animationSpeed}
            loop={this.state.loop}
            autoMovement={this.state.autoMovement}
            trailLength={this.state.trailLength}
            currentTime={this.state.currentTime}
            setCurrentTime={this._setCurrentTime}
            animationBounds={animationBounds}
          />
        </MapboxGLMap>
        <Clock time={this.state.currentTime} />
        <Sidebar
          categorizedData={this.state.categorizedData}
          height={this.state.height}
          toggleCategoryVisible={this._toggleCategoryVisible}
          isAnimating={this.state.isAnimating}
          setAnimating={this._setAnimating}
          onPlay={this._onPlay}
          onPause={this._onPause}
          loop={this.state.loop}
          toggleLoop={this._toggleLoop}
          autoMovement={this.state.autoMovement}
          toggleAutoMovement={this._toggleAutoMovement}
          trailLength={this.state.trailLength}
          trailRange={this._trailRange}
          onTrailLengthChange={this._onTrailLengthChange}
          onChangeCategoryColor={this._onChangeCategoryColor}
          currentTime={this.state.currentTime}
          setCurrentTime={this._setCurrentTime}
          animationBounds={animationBounds}
          animationSpeed={this.state.animationSpeed}
          animationSpeedRange={this._animationSpeedRange}
          onAnimationSpeedChange={this._onAnimationSpeedChange}
          mapStyle={this.state.mapStyle}
          mapStyleOptions={MAP_STYLES}
          setMapStyle={this._setMapStyle}
          goto={this.state.goto}
          onGotoChange={this._onGotoChange}
          onGoto={this._onGoto}
          jump={this.state.jump}
          onJumpChange={this._onJumpChange}
          onJumpForward={this._onJumpForward}
          onJumpBackward={this._onJumpBackward}
          autoRotateSpeed={this.state.autoRotateSpeed}
          onAutoRotateSpeedChange={this._onAutoRotateSpeedChange}
          autoZoomSpeed={this.state.autoZoomSpeed}
          onAutoZoomSpeedChange={this._onAutoZoomSpeedChange}
          autoPitchSpeed={this.state.autoPitchSpeed}
          onAutoPitchSpeedChange={this._onAutoPitchSpeedChange}
          autoLatSpeed={this.state.autoLatSpeed}
          onAutoLatSpeedChange={this._onAutoLatSpeedChange}
          autoLonSpeed={this.state.autoLonSpeed}
          onAutoLonSpeedChange={this._onAutoLonSpeedChange}
          bearing={this.state.mapViewState.bearing}
          zoom={this.state.mapViewState.zoom}
          pitch={this.state.mapViewState.pitch}
          latitude={this.state.mapViewState.latitude}
          longitude={this.state.mapViewState.longitude}
          onBearingChange={this._onBearingChange}
          onZoomChange={this._onZoomChange}
          onPitchChange={this._onPitchChange}
          onLatChange={this._onLatChange}
          onLonChange={this._onLonChange}
          allCategoriesVisible={this.state.allCategoriesVisible}
          toggleAllCategoriesVisibility={this._toggleAllCategoriesVisibility}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
