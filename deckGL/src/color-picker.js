import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import autoBind from 'react-autobind';

import {PhotoshopPicker} from 'react-color';
import './color-picker.scss';


export default class ColorPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayPicker: false,
    };
    autoBind(this);
  }

  _handleClick(e) {
    if (this.state.displayPicker)
      this._closePicker(e);
    else
      this._openPicker(e);
  }

  _clickListener(e) {
    let target = e.target;
    while(target) {
      if(target == this._divPicker)
        return;
      target = target.parentNode;
    }
    this._closePicker();
  }

  _openPicker(e) {
    this.setState({displayPicker: true});
    window.addEventListener('click', this._clickListener);
    e.stopPropagation();
  }

  _closePicker() {
    this.setState({displayPicker: false});
    window.removeEventListener('click', this._clickListener);
  }

  _fromRGBArray(colorArray) {
    return {'r': colorArray[0], 'g': colorArray[1], 'b': colorArray[2]};
  }
  _toRGBArray(color) {
    const rgbColor = color.rgb;
    return [rgbColor.r, rgbColor.g, rgbColor.b];
  }

  _onChangeColor(color) {
    this._tmpNewColor = color;
  }

  _onAcceptColor(e) {
    const rgbArray = this._toRGBArray(this._tmpNewColor);
    this.props.onChangeColor(rgbArray);
    this._closePicker();
  }

  render() {
    return (
      <div>
        <div className='colorPreviewBox'
          onClick={this._handleClick}
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
              onChangeComplete={this._onChangeColor}
              onAccept={this._onAcceptColor}
              onCancel={this._closePicker}
            />
          </div>
        : null}
      </div>
    );
  }
}
