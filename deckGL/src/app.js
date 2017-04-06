import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MapboxGLMap from './mapgl.js';
import autoBind from 'react-autobind';

import {MAP_STYLES} from './constants';
import BeamDeckGL from './BeamDeckGL';
import Sidebar from './sidebar';
import Clock from './components/Clock';
import {getCategorizedLayers, setCategoryColor, toggleCategoryVisible} from './category-manager';

import tripsDataJson from './trips.json';



class App extends Component {
  constructor(props) {
    super(props);

     this.handleClick = this.handleClick.bind(this);
     this.handleFrameSizeF = this.handleFrameSizeF.bind(this);
     this.handleFrameSizeD = this.handleFrameSizeD.bind(this);


    const categorizedData = getCategorizedLayers(tripsDataJson);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      categorizedData: categorizedData,
      mapViewState: {
        latitude: 37.82785803280886,
        longitude: -122.43169756795798,
        zoom: 10.82,
        pitch: 60,
        bearing: 0
      },
      isAnimating: true,
      animationSpeed: 300,        // 1 second in the animation, represents 300 seconds in real life
      loop: true,
      trailLength: 150,
      currentTime: categorizedData[0].startTime,
      mapStyle: MAP_STYLES[5],
      allCategoriesVisible: true,
    }

    this._trailRange = {
      min: 10,
      max: 1000
    };
    this._animationSpeedRange = {
      min: 1,
      max: 1000
    };
    this._allCategoriesHidden = false;
    this._userPaused = false;    // when animation is stopped due to all categories being hidden

    autoBind(this);
  }

    handleClick(event) {

       const jumpValue = document.getElementById("jump").value;

       if(jumpValue.length > 6){

         alert("Max length will be 6");

         return false;
       }

       this.setState({jump: jumpValue});
    }
    
    handleFrameSizeD(event) {
        
        const frameSizeValueD = document.getElementById("framesize").value;

        if(frameSizeValueD.length > 6){

           alert("Max length will be 6");

           return false;
         }

        this.setState({FrameValueD:frameSizeValueD});
    }

    handleFrameSizeF(event) {

       const frameSizeValueF = document.getElementById("framesize").value;

       if(frameSizeValueF.length > 6){

           alert("Max length will be 6");

           return false;
        }

       this.setState({FrameValueF: frameSizeValueF});
    }

  componentDidMount() {
    window.addEventListener('resize', this._onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  _onResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onChangeViewport(mapViewState) {
    if (mapViewState.pitch > 60) {
      mapViewState.pitch = 60;
    }
    this.setState({mapViewState});
  }

  _setAnimating(isAnimating, userPaused) {
    if (isAnimating && this._allCategoriesHidden) return;
    this.setState({isAnimating});
    this._userPaused = userPaused;
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

    let jump = this.state.jump;

    let  fkeyD = this.state.FrameValueD;

    let  fkeyF = this.state.FrameValueF;
    
    if(jump > 0){

     currentTime  = 0 + parseInt(jump);

     this.setState({currentTime});

     document.getElementById("jump").value = 0;

     this.handleClick();

     document.getElementById("jump").value = parseInt(jump);
    }
    else{

      this.setState({currentTime});
    }

    if(fkeyD > 0){

     currentTime  = parseInt(currentTime) - parseInt(fkeyD);

     this.setState({currentTime});

     document.getElementById("framesize").value = 0;

     this.handleFrameSizeD();

     document.getElementById("framesize").value = parseInt(fkeyD);

    }
    else{


      this.setState({currentTime});
    }

    if(fkeyF > 0){

     currentTime  = parseInt(currentTime) + parseInt(fkeyF);

     this.setState({currentTime});

     document.getElementById("framesize").value = 0;

     this.handleFrameSizeF();

     document.getElementById("framesize").value = parseInt(fkeyF);;
    }
    else{

      this.setState({currentTime});
    }

  }

  _getAnimationTimeBounds(categorizedData) {
    let visibleCategories = categorizedData.filter(categoryData => categoryData.visible);
    if (visibleCategories.length === 0) {
      visibleCategories = categorizedData;   // else startTime and endTime will be Infinity and -Infinity
    }
    const startTime = Math.min.apply(null, visibleCategories.map(categoryData => categoryData.startTime));
    const endTime = Math.max.apply(null, visibleCategories.map(categoryData => categoryData.endTime));
    return {
      startTime,
      endTime,
    };
  }

  _onAnimationSpeedChange(animationSpeed) {
    this.setState({animationSpeed});
  }

  _setMapStyle(style) {
    const mapStyle = MAP_STYLES.filter(ms => ms.style == style)[0];
    this.setState({mapStyle});
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
          mapRef={map => this._map = map}
        >
          <BeamDeckGL
            mapViewState={this.state.mapViewState}
            categorizedData={this.state.categorizedData}
            width={this.state.width} height={this.state.height}
            isAnimating={this.state.isAnimating}
            setAnimating={this._setAnimating}
            animationSpeed={this.state.animationSpeed}
            loop={this.state.loop}
            trailLength={this.state.trailLength}
            currentTime={this.state.currentTime}
            setCurrentTime={this._setCurrentTime}
            animationBounds={animationBounds}
          />
        </MapboxGLMap>
        <Clock time={this.state.currentTime} />
        <Sidebar
          categorizedData={this.state.categorizedData}
          toggleCategoryVisible={this._toggleCategoryVisible}
          isAnimating={this.state.isAnimating}
          setAnimating={this._setAnimating}
          onPlay={this._onPlay}
          onPause={this._onPause}
          loop={this.state.loop}
          toggleLoop={this._toggleLoop}
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
          handleClick={this.handleClick}
          handleFrameSizeD={this.handleFrameSizeD}
          handleFrameSizeF={this.handleFrameSizeF}
          frameval={this.state.frameval}
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
