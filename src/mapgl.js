import GLMap from 'react-map-gl';

const loadBuildings = (map) => {
  map.on('load', () => {
    map.addLayer({
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 13,
      'paint': {
        'fill-extrusion-color': 'rgb(29,27,27)',
        'fill-extrusion-height': {
          'type': 'identity',
          'property': 'height'
        },
        'fill-extrusion-base': {
          'type': 'identity',
          'property': 'min_height'
        },
        'fill-extrusion-opacity': 0.8
      }
    });
  });
}

export default class MapboxGLMap extends GLMap {
  componentDidMount() {
    super.componentDidMount();
    if (this.props.mapRef) {
      this.props.mapRef(this._map);
    }
    loadBuildings(this._map);
  }
}

