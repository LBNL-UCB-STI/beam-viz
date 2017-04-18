import {
  CATEGORY_COLORS,
  COLOR_OPTIONS,
} from './constants';

const normalizeValue = (minValue, maxValue, value) => (
  (minValue === maxValue)
  ? 1
  : (value - minValue) / (maxValue - minValue)
);

const getNormalizedColor = (lowColor, highColor, normalValue) => (
  lowColor.map((c, i) => c + (highColor[i] - c) * normalValue)
);

const getCategoryDescription = categoryData => {
  if (categoryData.typ[0] === '.') {
    return {
      categoryType: 'dot',
      categoryName: categoryData.typ.substr(1),
    };
  }
  return {
    categoryType: 'trip',
    categoryName: categoryData.typ,
  };
};

let autoColoredCount = 0;
const newCategory = (categoryName, categoryType) => {
  let category = {
    categoryName,
    categoryType,
    color: CATEGORY_COLORS[categoryName],
    shps: [],
    startTime: Infinity,
    endTime: -Infinity,
    visible: true,
    minValue: Infinity,
    maxValue: -Infinity,
  };

  if (!category.color) {
    category.color = COLOR_OPTIONS[autoColoredCount % COLOR_OPTIONS.length];
    autoColoredCount++;
  }

  if (categoryName === 'CHOICE') {
    category.getColor = (categoryData, path) => {
      const value = path.choiceValue;
      const normalValue = normalizeValue(categoryData.minValue, categoryData.maxValue, value);
      return getNormalizedColor(categoryData.color.lowColor, categoryData.color.highColor, normalValue);
    };
    category.colorID = category.color.lowColor.concat(category.color.highColor).join('');
  }
  else {
    category.colorID = category.color.join('');
  }
  return category;
};

const createStarBurst = (time, location) => {
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
  let vizData = [];
  for (let rayIndex = 0; rayIndex < numRays; ++rayIndex) {
    let ray = [];
    frameIndices.map(frameIndex => {
      let len = radiusFromOrigin[frameIndex];
      let x = location[0] + len * Math.cos(deltaRadian * rayIndex);
      let y = location[1] + len * Math.sin(deltaRadian * rayIndex);
      let frameTime = time + paceInTicksPerFrame * frameIndex;
      ray.push([x, y, frameTime]);
    });
    vizData.push(ray);
  }
  return vizData;
};

const getCategorizedLayers = (data) => {
  /*
   * TODO update this
   * Input format: [InputTrip 1, InputTrip 2, ...]
   * InputTrip format: [[InputLeg 1, InputLeg 2, ...]
   * InputLeg format: {
        "typ": "car",
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
  let categorizedData = {};

  data.map(categoryData => {
    const {categoryName, categoryType} = getCategoryDescription(categoryData);
    const shp = categoryData.shp;

    if (shp.length === 0 )
      return;

    if (categoryName.toUpperCase() === 'ERROR')     // HARDCODED
      return;

    if (categoryName.toUpperCase() === 'LEG_SWITCH')     // HARDCODED
      return;

    if (categoryNames.indexOf(categoryName) === -1) {
      categorizedData[categoryName] = newCategory(categoryName, categoryType);
      categoryNames.push(categoryName);
    }
    let category = categorizedData[categoryName];

    if (categoryName == "STAR") {
      let starShape = createStarBurst(shp[2], [shp[0], shp[1]]);
      category.shps = [...category.shps, ...starShape];
    }
    else {
      category.shps.push(shp);
    }

    let shpStartTime, shpEndTime;
    if (categoryName === 'STAR') {
      shpStartTime = shp[2];
      let ray = category.shps[category.shps.length - 1];
      shpEndTime = ray[ray.length - 1][2];
    }
    else if (categoryType === 'trip') {
      shpStartTime = shp[0][2];
      shpEndTime = shp[shp.length - 1][2];
    }
    else if (categoryType === 'dot') {
      shpStartTime = shp[2];
      shpEndTime = shp[3];
    }

    if (shpStartTime < category.startTime) {
      category.startTime = shpStartTime;
    }
    if (shpEndTime > category.endTime) {
      category.endTime = shpEndTime;
    }

    if (categoryName === 'CHOICE') {
      const val = categoryData.val;
      if (val < category.minValue)
        category.minValue = val;
      if (val > category.maxValue)
        category.maxValue = val;
      shp.choiceValue = val;
    }

  });

  return categoryNames.map(
    categoryName => categorizedData[categoryName]
  );
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
