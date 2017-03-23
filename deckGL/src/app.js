import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MapboxGLMap from 'react-map-gl';
import autoBind from 'react-autobind';

import BeamDeckGL from './BeamDeckGL';
import Sidebar from './sidebar';
import tripsData from './trips.json';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicndsYm5sIiwiYSI6ImNqMGU3bjE5YjAxMDkzM3F5emQxcHU4ZnUifQ.WnLnWmzjvp9d1dvi3egHwQ';
const mapStyle = "mapbox://styles/mapbox/light-v9";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      tripsData: this._parseTripsData(tripsData),
      mapViewState: { 
        latitude: 37.75576410580251,
        longitude: -122.41136076769214,
        zoom: 11.77,
        pitch: 40,
        bearing: 0
      },
      isAnimating: true,
      animationTime: 80000,    // actual time animation should take to finish a loop
      loop: true,
      trailLength: 150,
      currentTime: 0.2,
	  animationLength: 30000
    }

    this._trailRange = {
      min: 10,
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
        "begin_shape": [-122.394181, 37.793991],
        "end_shape": [-122.394845, 37.794448],
        "begin_time": 0,
        "end_time": 11
      }
     *
     * output format: [Category 1, Category 2, ...]
     * Category format: {name: 'Category 1', color: 'c', paths: [Path 1, Path 2, Path 3]}
     * Path format: [Leg 1, Leg 2, ..]
     * Leg format: [[lng 1, lat 1, time 1], [lng 2, lat 2, time 2], ...]
     */
    let categories = [];
    let colorOptions = [[100, 240, 100], [253, 128, 93], [0, 204, 255], [255, 255, 0]];
    let categorizedTrips = {};

    this._animationLength = 0;

    tripsData.map(tripData => {
      let category = tripData[0].travel_type;
      if (categories.indexOf(category) === -1) {
        categories.push(category);
        categorizedTrips[category] = [];
      }

      let path = tripData.map(
        leg => [leg.begin_shape[0], leg.begin_shape[1], leg.begin_time]
      );
      categorizedTrips[category].push(path);

      let last_leg = path[path.length-1];
      if (last_leg[2] > this._animationLength)
        this._animationLength = last_leg[2];
    });

    return categories.map((category, i) => {
      return {
        category,
        color: colorOptions[i % colorOptions.length],
        paths: categorizedTrips[category],
        visible: true
      };
    })
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
            if(d.category !== categoryName)
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
        if (d.category !== categoryName)
          return d;
        return {...d, color};
      }),
    });
  }

  _setCurrentTime(currentTime) {
    this.setState({currentTime});
  }

  render() {
    return (
      <div>
        <MapboxGLMap
          mapStyle={mapStyle}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          {...this.state.mapViewState}
          width={this.state.width} height={this.state.height}
          perspectiveEnabled
          onChangeViewport={this._onChangeViewport}
        >
          <BeamDeckGL
            mapViewState={this.state.mapViewState}
            tripsData={this.state.tripsData}
            width={this.state.width} height={this.state.height}
            isAnimating={this.state.isAnimating}
            setAnimating={this._setAnimating}
            animationTime={this.state.animationTime}
            loop={this.state.loop}
            trailLength={this.state.trailLength}
            currentTime={this.state.currentTime}
            animationLength={this._animationLength}
            setCurrentTime={this._setCurrentTime}
          />
        </MapboxGLMap>
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
          animationLength={this._animationLength}
          setCurrentTime={this._setCurrentTime}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
