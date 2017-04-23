import {
  CATEGORY_COLORS,
  COLOR_OPTIONS,
} from './constants';

// given a range, return the "normal" value of a number from 0 to 1 by interpolation
const normalizeValue = (minValue, maxValue, value) => (
  (minValue === maxValue)
  ? 1
  : (value - minValue) / (maxValue - minValue)
);

// given color range, return the "normal" color of a "normal value" by interpolation
const getNormalizedColor = (lowColor, highColor, normalValue) => (
  lowColor.map((c, i) => c + (highColor[i] - c) * normalValue)
);

// given categoryData, return name and type of category
const getCategoryDescription = ({typ, kind, mode}) => {
  const categoryName = kind || mode;
  let categoryType = typ;   // currently it can be on of 'trajectory' or 'dot'
  if (typ === 'pointProcess')
    categoryType = categoryName === 'CHOICE' ? 'trajectory': 'dot';
  return {
    categoryType,
    categoryName,
  };
};

// given a list of colors, return a different one (in a cycle) with each function call
const getNextColor = (() => {
  let autoColoredCount = 0;
  return () => COLOR_OPTIONS[(autoColoredCount++) % COLOR_OPTIONS.length];
})();

const newCategory = (categoryName, categoryType) => {
  let category = {
    categoryName,
    categoryType,
    color: CATEGORY_COLORS[categoryName] || getNextColor(),
    shps: [],
    startTime: Infinity,
    endTime: -Infinity,
    visible: true,
    minValue: Infinity,
    maxValue: -Infinity,
  };

  if (categoryName === 'CHOICE') {
    category.getColor = (categoryData, path) => {
      const {minValue, maxValue, color} = categoryData;
      const normalValue = normalizeValue(minValue, maxValue, path.choiceValue);
      return getNormalizedColor(color.lowColor, color.highColor, normalValue);
    };
    category.colorID = category.color.lowColor.concat(category.color.highColor).join('');
  }
  else {
    category.colorID = category.color.join('');
  }
  return category;
};

const createStarBurst = (startTime, location) => {
  const radialLength = 0.0035;
  const paceInTicksPerFrame = 25;
  const numRays = 10;
  const directionOut = true;
  const numFrames = 4;
  let radiusFromOrigin = [...Array(numFrames).keys()];
  radiusFromOrigin = radiusFromOrigin.map(i => radialLength * i / (numFrames - 1));
  let deltaRadian = 2 * Math.PI / numRays;
  let frameIndices = [...Array(numFrames).keys()];
  if (!directionOut) frameIndices.reverse();
  let shp = [];
  for (let rayIndex = 0; rayIndex < numRays; ++rayIndex) {
    let ray = [];
    frameIndices.map(frameIndex => {
      let len = radiusFromOrigin[frameIndex];
      let x = location[0] + len * Math.cos(deltaRadian * rayIndex);
      let y = location[1] + len * Math.sin(deltaRadian * rayIndex);
      let frameTime = startTime + paceInTicksPerFrame * frameIndex;
      ray.push([x, y, frameTime]);
    });
    shp.push(ray);
  }
  return shp;
};

const getCategorizedLayers = (data) => {
  /*
   * output format: [Category 1, Category 2, ...]
   * Category format: {categoryName: 'Category 1', color: 'c', paths: [Path 1, Path 2, Path 3]}
   * Path format: [Leg 1, Leg 2, ..]
   * Leg format: [[lng 1, lat 1, time 1], [lng 2, lat 2, time 2], ...]
   */
  let categorizedData = {
    // categoryName
    // categoryType
    // shps         (paths)
    // color        ({lowColor, highColor} in case of CHOICE)
    // colorID      (calculated based on value of color)
    // getColor()   (for CHOICE only)
    // startTime
    // endTime
    // visible
    // minValue     (for CHOICE only)
    // maxValue     (for CHOICE only)
  };
  let categoryNames = [];

  data.map(d => {
    const {categoryName, categoryType} = getCategoryDescription(d);
    const shp = d.shp;

    // ignore if no shape data is available or for certain pre-defined categories
    if (shp.length === 0
      || categoryName.toUpperCase() === 'ERROR'
      || categoryName.toUpperCase() === 'LEG_SWITCH'
    ) return;

    // Create new category if not encountered before
    if (categoryNames.indexOf(categoryName) === -1) {
      categorizedData[categoryName] = newCategory(categoryName, categoryType);
      categoryNames.push(categoryName);
    }

    // current category
    let category = categorizedData[categoryName];

    // insert shapes for the category
    if (categoryName === 'CHOICE') {
      const starShape = createStarBurst(d.startTime, shp[0]);
      const val = d.val;
      category.minValue = Math.min(category.minValue, val);
      category.maxValue = Math.max(category.maxValue, val);
      starShape.map(shp => shp.choiceValue = val);
      category.shps = [...category.shps, ...starShape];
    }
    else if (categoryType === 'dot'){
      category.shps.push([...shp[0], d.startTime, d.endTime]);
    }
    else {
      category.shps.push(shp);
    }

    // Calculate the category's time-bounds
    let shpStartTime, shpEndTime;
    if (categoryName === 'CHOICE') {
      shpStartTime = d.startTime;
      let ray = category.shps[category.shps.length - 1];
      shpEndTime = ray[ray.length - 1][2];
    }
    else if (categoryType === 'dot') {
      shpStartTime = d.startTime;
      shpEndTime = d.endTime;
    }
    else {      // if (categoryType === 'trajectory') {
      shpStartTime = shp[0][2];
      shpEndTime = shp[shp.length - 1][2];
    }
    category.startTime = Math.min(category.startTime, shpStartTime);
    category.endTime = Math.max(category.endTime, shpEndTime);

    // Other special cases
    if (categoryName === 'CHOICE') {
      const val = d.val;
      category.minValue = Math.min(category.minValue, val);
      category.maxValue = Math.max(category.maxValue, val);
      shp.choiceValue = val;
    }

  });

  return categoryNames.map(categoryName => categorizedData[categoryName]);
}

const setCategoryColor = (categorizedData, categoryName, color) => (
  categorizedData.map(categoryData => {
    if (categoryData.categoryName === 'CHOICE' && (categoryName === 'CHOICE_HIGH' || categoryName === 'CHOICE_LOW')) {
      const lowColor = (categoryName === 'CHOICE_LOW') ? color : categoryData.color.lowColor;
      const highColor = (categoryName === 'CHOICE_HIGH') ? color : categoryData.color.highColor;
      return {
        ...categoryData,
        color: {lowColor, highColor},
        colorID: lowColor.concat(highColor).join(''),
      };
    }
    if (categoryData.categoryName !== categoryName) {
      return categoryData;
    }
    return {
      ...categoryData,
      color,
      colorID: color.join('')
    };
  })
);

const toggleCategoryVisible = (categorizedData, categoryName) => {
  if (categoryName === 'CHOICE_HIGH' || categoryName === 'CHOICE_LOW') {
    categoryName = 'CHOICE';
  }
  return categorizedData.map(categoryData => {
    if (categoryData.categoryName !== categoryName) return categoryData;
    return {
      ...categoryData,
      visible: !categoryData.visible
    };
  });
};


module.exports = {
  getCategorizedLayers,
  setCategoryColor,
  toggleCategoryVisible,
};
