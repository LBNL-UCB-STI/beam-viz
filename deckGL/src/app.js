import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MapboxGLMap from './mapgl.js';
import autoBind from 'react-autobind';

import BeamDeckGL from './BeamDeckGL';
import Sidebar from './sidebar';
import Clock from './components/Clock';
import {getCategorizedLayers, setCategoryColor, toggleCategoryVisible} from './category-manager';

import tripsDataJson from './trips.json';

const mapStyleOptions = [
  {
    style: "Streets",
    url: "mapbox://styles/mapbox/streets-v10",
    accessToken: "pk.eyJ1IjoicndsYm5sIiwiYSI6ImNqMGU3bjE5YjAxMDkzM3F5emQxcHU4ZnUifQ.WnLnWmzjvp9d1dvi3egHwQ"
  },
  {
    style: "Light",
    url: "mapbox://styles/mapbox/light-v9",
    accessToken: "pk.eyJ1IjoicndsYm5sIiwiYSI6ImNqMGU3bjE5YjAxMDkzM3F5emQxcHU4ZnUifQ.WnLnWmzjvp9d1dvi3egHwQ"
  },
  {
    style: "Satellite",
    url: "mapbox://styles/mapbox/satellite-v9",
    accessToken: "pk.eyJ1IjoicndsYm5sIiwiYSI6ImNqMGU3bjE5YjAxMDkzM3F5emQxcHU4ZnUifQ.WnLnWmzjvp9d1dvi3egHwQ"
  },
  {
    style: "Satellite Streets",
    url: "mapbox://styles/mapbox/satellite-streets-v10",
    accessToken: "pk.eyJ1IjoicndsYm5sIiwiYSI6ImNqMGU3bjE5YjAxMDkzM3F5emQxcHU4ZnUifQ.WnLnWmzjvp9d1dvi3egHwQ"
  },
  {
    style: "Dark",
    url: "mapbox://styles/mapbox/dark-v9",
    accessToken: "pk.eyJ1IjoicndsYm5sIiwiYSI6ImNqMGU3bjE5YjAxMDkzM3F5emQxcHU4ZnUifQ.WnLnWmzjvp9d1dvi3egHwQ"
  },
  {
    style: "Dark - No Label",
    url: "mapbox://styles/rwlbnl/cj0e7o9f6000r2skgfjsutrg9",
    accessToken: "pk.eyJ1IjoicndsYm5sIiwiYSI6ImNqMGU3bjE5YjAxMDkzM3F5emQxcHU4ZnUifQ.WnLnWmzjvp9d1dvi3egHwQ"
  },
];


class App extends Component {
  constructor(props) {
    super(props);

    const categorizedData = getCategorizedLayers(tripsDataJson);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      categorizedData: categorizedData,
      mapViewState: {
        latitude: 37.82785803280886,
        longitude: -122.43169756795798,
        zoom: 9.82,
        pitch: 60,
        bearing: 0
      },
      isAnimating: true,
      animationSpeed: 300,        // 1 second in the animation, represents 300 seconds in real life
      loop: true,
      trailLength: 150,
      currentTime: categorizedData[0].startTime,
      mapStyle: mapStyleOptions[5],
    }

    this._trailRange = {
      min: 10,
      max: 1000
    };
    this._animationSpeedRange = {
      min: 1,
      max: 1000
    };

    autoBind(this);
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

  _setAnimating(isAnimating) {
    this.setState({isAnimating});
  }

  _toggleLoop() {
    this.setState({loop: !this.state.loop});
  }

  _toggleCategoryVisible(categoryName) {
    this.setState({
      categorizedData: toggleCategoryVisible(this.state.categorizedData, categoryName)
    });
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
    const visibleCategories = categorizedData.filter(categoryData => categoryData.visible);
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
    const mapStyle = mapStyleOptions.filter(ms => ms.style == style)[0];
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
          mapStyleOptions={mapStyleOptions}
          setMapStyle={this._setMapStyle}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
