import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MapboxGLMap from './mapgl.js';
import autoBind from 'react-autobind';

import BeamDeckGL from './BeamDeckGL';
import Sidebar from './sidebar';
import Clock from './components/clock';

import tripsDataJson from './trips.json';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicndsYm5sIiwiYSI6ImNqMGU3bjE5YjAxMDkzM3F5emQxcHU4ZnUifQ.WnLnWmzjvp9d1dvi3egHwQ';
const mapStyleOptions = [
  {
    style: "Streets",
    url: "mapbox://styles/mapbox/streets-v10"
  },
  {
    style: "Light",
    url: "mapbox://styles/mapbox/light-v9"
  },
  {
    style: "Satellite",
    url: "mapbox://styles/mapbox/satellite-v9"
  },
  {
    style: "Satellite Streets",
    url: "mapbox://styles/mapbox/satellite-streets-v10"
  },
  {
    style: "Dark",
    url: "mapbox://styles/mapbox/dark-v9"
  },
];


class App extends Component {
  constructor(props) {
    super(props);
    const tripsData = this._parseTripsData(tripsDataJson);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      tripsData: tripsData,
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
      currentTime: tripsData[0].startTime,
      mapStyle: mapStyleOptions[4],
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

  _parseTripsData(tripsData) {
    /*
     * Input format: [InputTrip 1, InputTrip 2, ...]
     * InputTrip format: [[InputLeg 1, InputLeg 2, ...]
     * InputLeg format: {
        "travel_type": "car",
        "instruction": "Drive northwest on Steuart Street.",
        "length": 0.049,
        "shp": [-122.394181, 37.793991],
        "tim": 0,
        "end_time": 11
      }
     *
     * output format: [Category 1, Category 2, ...]
     * Category format: {name: 'Category 1', color: 'c', paths: [Path 1, Path 2, Path 3]}
     * Path format: [Leg 1, Leg 2, ..]
     * Leg format: [[lng 1, lat 1, time 1], [lng 2, lat 2, time 2], ...]
     */
    let categoryNames = [];
    const colorOptions = [[100, 240, 100], [253, 128, 93], [0, 204, 255], [255, 255, 0]];
    let categorizedTrips = {};

    tripsData.map(tripData => {
      const categoryName = tripData[0].typ;

      if (categoryNames.indexOf(categoryName) === -1) {
        categorizedTrips[categoryName] = {
          categoryName,
          color: colorOptions[categoryNames.length % colorOptions.length],
          paths: [],
          startTime: Infinity,
          endTime: -Infinity,
          visible: true,
        };
        categoryNames.push(categoryName);
      }
      let category = categorizedTrips[categoryName];

      const path = tripData.map(
        leg => [leg.shp[0], leg.shp[1], leg.tim]
      );
      category.paths.push(path);

      if (path[0][2] < category.startTime) {
        category.startTime = path[0][2];
      }
      if (path[path.length - 1][2] > category.endTime) {
        category.endTime = path[path.length - 1][2];
      }

    });

    return categoryNames.map(
      categoryName => categorizedTrips[categoryName]
    );
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
    if(mapViewState.pitch > 60) {
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
        tripsData: this.state.tripsData.map(d => {
            if(d.categoryName !== categoryName)
                return d;
            return {
                ...d,
                visible: !d.visible,
            }
        })
    });
  }

  _onTrailLengthChange(trailLength) {
    this.setState({trailLength});
  }

  _onChangeCategoryColor(categoryName, color) {
    this.setState({
      tripsData: this.state.tripsData.map(d => {
        if (d.categoryName !== categoryName)
          return d;
        return {...d, color};
      }),
    });
  }

  _setCurrentTime(currentTime) {
    this.setState({currentTime});
  }

  _getAnimationTimeBounds(tripsData) {
    const visibleCategories = tripsData.filter(tripData => tripData.visible);
    const startTime = Math.min.apply(null, visibleCategories.map(tripData => tripData.startTime));
    const endTime = Math.max.apply(null, visibleCategories.map(tripData => tripData.endTime));
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
    const animationBounds = this._getAnimationTimeBounds(this.state.tripsData);
    return (
      <div>
        <MapboxGLMap
          mapStyle={this.state.mapStyle.url}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          {...this.state.mapViewState}
          width={this.state.width} height={this.state.height}
          perspectiveEnabled
          onChangeViewport={this._onChangeViewport}
          mapRef={map => this._map = map}
        >
          <BeamDeckGL
            mapViewState={this.state.mapViewState}
            tripsData={this.state.tripsData}
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
          tripsData={this.state.tripsData}
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
