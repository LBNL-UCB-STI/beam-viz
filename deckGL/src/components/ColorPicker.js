import React, {Component} from 'react';

import autoBind from 'react-autobind';

import {PhotoshopPicker} from 'react-color';
import './ColorPicker.scss';


export default class ColorPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayPicker: false,
    };

    this._originalColor = null;
    autoBind(this);
  }

  _handlePreviewClick(e) {
    if (this.state.displayPicker)
      this._closePicker(e);
    else
      this._openPicker(e);
  }

  _openPicker(e) {
    this.setState({displayPicker: true});
    this._originalColor = this.props.color;
  }

  _closePicker() {
    this.setState({displayPicker: false});
    this._originalColor = null;
  }

  _onChange(color) {
    const rgbArray = this._toRGBArray(color);
    this.props.onChangeColor(rgbArray);
  }

  _onAcceptColor(e) {
    this._closePicker();
  }

  _onCancel() {
    this.props.onChangeColor(this._originalColor);
    this._closePicker();
  }

  _fromRGBArray(colorArray) {
    return {'r': colorArray[0], 'g': colorArray[1], 'b': colorArray[2]};
  }

  _toRGBArray(color) {
    const rgbColor = color.rgb;
    return [rgbColor.r, rgbColor.g, rgbColor.b];
  }

  render() {
    return (
      <div>
        <div className='colorPreviewBox'
          onClick={this._handlePreviewClick}
        >
          <div className='colorPreview'
            style={{backgroundColor: 'rgb(' + this.props.color.join(',') + ')'}}
          />
        </div>

        {this.state.displayPicker ?
          <div className='photoshopColorPicker'
            ref={divPicker => this._divPicker = divPicker}
            style={{zIndex:10}}
          >
            <PhotoshopPicker
              header={'Pick color for: ' + this.props.categoryName}
              color={this._fromRGBArray(this.props.color)}
              onChange={this._onChange}
              onAccept={this._onAcceptColor}
              onCancel={this._onCancel}
            />
          </div>
        : null}
      </div>
    );
  }
}
