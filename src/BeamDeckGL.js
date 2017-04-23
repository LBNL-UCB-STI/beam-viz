import React, {Component} from 'react';
import DeckGL, {ScatterplotLayer, ExtrudedChoroplethLayer64} from 'deck.gl';
import autoBind from 'react-autobind';

import TripsLayer from './trips-layer';
import {REFRESH_INTERVAL} from './constants';

export default class BeamDeckGL extends Component {
  constructor(props) {
    super(props);

    this._buildingColor = [74, 80, 87];
    autoBind(this);
  }

  componentDidMount() {
    if (this.props.isAnimating) {
      this._startAnimation();
    }
  }

  componentWillUnmount() {
    this._stopAnimation();
  }

  componentWillReceiveProps(newProps) {
    const {isAnimating, animationSpeed} = this.props;
    if (isAnimating && newProps.animationSpeed !== animationSpeed) {
        this._stopAnimation();
        this._startAnimation(newProps);
    }
    if (newProps.isAnimating !== isAnimating) {
      if (isAnimating) {
        this._stopAnimation();
      }
      else {
        this._startAnimation();
      }
    }
  }

  _startAnimation({animationSpeed} =  this.props) {
    // currentTime, animationSpeed and animationBounds are in seconds,
    // REFRESH_INTERVAL is in milli-seconds
    const speed = animationSpeed * REFRESH_INTERVAL / 1000;
    this._animator = setInterval(() => {
      const {currentTime, animationBounds, setCurrentTime} = this.props;
      let time = currentTime;
      if (currentTime < animationBounds.startTime) {
        time = animationBounds.startTime;
      }
      else {
        time += speed;
      }
      if (time > animationBounds.endTime) {
        time = animationBounds.startTime;
        if (!this.props.loop) {
          this._stopAnimation();
          this.props.setAnimating(false);
        }
      }
      this.props.setCurrentTime(time);
    }, REFRESH_INTERVAL)
  }

  _stopAnimation() {
    clearInterval(this._animator);
  }

  _resetAnimation() {
    this.props.setCurrentTime({currentTime: 0});
    if (this.props.isAnimating) {
        this._stopAnimation();
        this._startAnimation();
    }
  }

  _onWebGLInitialized(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render() {
    const props = this.props;
    const {categorizedData, currentTime, trailLength, buildingData} = props;

    // new TripsLayer is created with each render.
    // The new layer's id is compared with the old's. If the id's match, the new layer is ignored..
    // If we want to update the color (or anything else) after initialization, it needs to be reflected in the id.
    const visibleCategories = categorizedData.filter(({ visible }) => visible);
    const tripLayers = visibleCategories.filter(({ categoryType }) => categoryType === 'trajectory')
      .map(categoryData => new TripsLayer({
        id: categoryData.categoryName + '-layer' + categoryData.colorID,
        data: categoryData.shps,
        getPath: trip => trip,
        getColor: path => (
          categoryData.getColor
          ? categoryData.getColor(categoryData, path)
          : categoryData.color
        ),
        strokeWidth: 2,
        trailLength: trailLength,
        currentTime,
      })
    );

    const dotLayers = visibleCategories.filter(({ categoryType }) => categoryType === 'dot')
      .map(categoryData => new ScatterplotLayer({
        id: categoryData.categoryName + '-layer' + categoryData.colorID + currentTime.toString(),
        data: categoryData.shps.filter(shp => currentTime >= shp[2] && currentTime <= shp[3]),
        radiusScale: 20,
        radiusMinPixels: 0.25,
        getPosition: d => [d[0], d[1], 0],
        getColor: d => categoryData.color,
        getRadius: d => 10,
      }));

    const buildingsLayer = buildingData && new ExtrudedChoroplethLayer64({
      id: 'building',
      data: buildingData,
      color: this._buildingColor,
      opacity: 0.5,
    })

    const layers = [...tripLayers, ...dotLayers, buildingsLayer].filter(Boolean);

    return (
      <DeckGL
        id="default-deckgl-overlay"
        {...props.mapViewState}
        width={props.width} height={props.height}
        layers={layers}
        onWebGLInitialized={this._onWebGLInitialized}
        effects={[]}
      />
  );
  }
}
