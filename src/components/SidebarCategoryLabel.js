import React from 'react';

import ColorPicker from './ColorPicker';

const SidebarCategoryLabel = ({
  categoryData: {
    categoryName,
    color,
    visible,
  },
  onChangeCategoryColor,
  toggleCategoryVisible,
  className,
}) => (
  <div className={className}>
    <div className='layer--description'>
      <div style={{display: 'inline-block'}}>
        <ColorPicker
          categoryName={categoryName}
          color={
            categoryName === 'CHOICE_HIGH'
              ? color.highColor
              : categoryName === 'CHOICE_LOW'
                ? color.lowColor
                : color
          }
          onChangeColor={newColor => onChangeCategoryColor(categoryName, newColor)}
        />
      </div>
      <div className='category-label'>
        <label htmlFor={'chk-' + categoryName}>
          <span>{categoryName}</span>
        </label>
      </div>
    </div>
    <div className='chk-category'>
      {categoryName !== 'CHOICE_LOW'
        ? (<input id={'chk-' + categoryName} type="checkbox"
            checked={visible}
            onChange={() => toggleCategoryVisible(categoryName)}
          />)
        : ''
      }
    </div>
  </div>
);

export default SidebarCategoryLabel;
