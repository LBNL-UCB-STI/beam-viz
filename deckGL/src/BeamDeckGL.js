import React, {Component} from 'react';
import DeckGL from 'deck.gl';
import {ExtrudedChoroplethLayer64} from 'deck.gl';
import autoBind from 'react-autobind';

import TripsLayer from './trips-layer';

export default class BeamDeckGL extends Component {
  constructor(props) {
    super(props);

    this._refreshInterval = 100;    // affects the "smoothness"
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
    const {isAnimating, animationTime} = this.props;
    if (isAnimating && newProps.animationTime !== animationTime) {
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

  _startAnimation({animationTime} =  this.props) {
    const speed = this._refreshInterval / animationTime;
    this._animator = setInterval(function() {
      let time = this.props.currentTime;
      time += speed;
      if (time > 1) {
        time = 0;
        if(!this.props.loop) {
          this._stopAnimation();
          this.props.setAnimating(false);
        }
      }
      this.props.setCurrentTime(time);
    }.bind(this), this._refreshInterval)
  }

  _stopAnimation() {
    clearInterval(this._animator);
  }

  _resetAnimation() {
    this.setState({time: 0});
    if(this.props.isAnimating) {
        this._stopAnimation();
        this._startAnimation();
    }
  }

  _onWebGLInitialized(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  _convertToTripTimeframe(time) {
    return time * this.props.animationLength;
  }

  render () {
    const props = this.props;
    const {tripsData, currentTime, trailLength, buildingData} = props;

    // new TripsLayer is created with each render.
    // The new layer's id is compared with the old's. If the id's match, the new layer is ignored..
    // If we want to update the color (or anything else) after initialization, it needs to be reflected in the id.
    let layers = tripsData.filter(tripData => tripData.visible)
      .map(tripData => new TripsLayer({
        id: tripData.category + '-layer' + tripData.color.join(''),
        data: tripData.paths,
        getPath: trip => trip,
        getColor: d => tripData.color,
        strokeWidth: 2,
        trailLength: trailLength,
        currentTime: this._convertToTripTimeframe(currentTime),
      })
    );

    if (buildingData) {
      layers.push(new ExtrudedChoroplethLayer64({
        id: 'building',
        data: buildingData,
        color: this._buildingColor,
        opacity: 0.5
      }));
    }

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
