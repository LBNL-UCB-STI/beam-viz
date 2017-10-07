/* global window,document */
import React, { Component } from "react";
import { render } from "react-dom";
import MapGL from "react-map-gl";
import DeckGLOverlay from "./deckgl-overlay.js";

import { csv as requestCsv } from "d3-request";

// Set your mapbox token here
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY29saW5zaGVwcGFyZCIsImEiOiJjaXBzczVxcHowNGVzaDducnIxOWthNXZ0In0.rDGXDr8YNlpiOmNBondDYA";

// Source data CSV
const DATA = [
  {
    name: "Energy",
    url:
      "https://s3.us-east-2.amazonaws.com/beam-outputs/experiment-2017-09-27/energy-deck-2.csv"
  },
  {
    name: "Bart",
    url:
      "https://raw.githubusercontent.com/LBNL-UCB-STI/beam-viz/master/data/bart.txt",
    default: true
  }
];

const DATA_MAP = {};
let defaultData;
DATA.map(d => {
  if (d.default) {
    defaultData = d;
  }
  DATA_MAP[d["name"]] = d;
});

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      dataID: null,
      data: null
    };

    this._updateData = this._updateData.bind(this);
  }

  componentWillMount() {
    this._updateData(defaultData.name);
  }

  _updateData(dataID) {
    const d = DATA_MAP[dataID];
    const { data } = d;
    if (data) {
      this.setState({ dataID, data });
    } else {
      const currentDataID = this.state.dataID;
      this.setState({ dataID });
      requestCsv(d.url, (error, response) => {
        if (!error) {
          d.data = response.map(row => [Number(row.lon), Number(row.lat)]);
          this.setState({ data: d.data });
        }
      });
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }

  render() {
    const { viewport, data } = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        <DeckGLOverlay viewport={viewport} data={data || []} />
        <select
          onChange={e => this._updateData(e.target.value)}
          style={{ position: "absolute", right: 50, top: 50 }}
          value={this.state.dataID}
        >
          {DATA.map(d => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement("div")));
