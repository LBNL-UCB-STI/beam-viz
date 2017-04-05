import {
  COLOR_OPTIONS,
  CAR_COLOR,
  CHOICE_LOW_COLOR,
  CHOICE_HIGH_COLOR,
} from './constants';

const normalizeValue = (minValue, maxValue, value) => (
  (minValue === maxValue)
  ? 1
  : (value - minValue) / (maxValue - minValue)
);

const normalizedColor = (lowColor, highColor, normalValue) => (
  lowColor.map((c, i) => c + (highColor[i] - c) * normalValue)
);

const getCategorizedLayers = (tripsData) => {
  /*
   * Input format: [InputTrip 1, InputTrip 2, ...]
   * InputTrip format: [[InputLeg 1, InputLeg 2, ...]
   * InputLeg format: {
        "travel_type": "car",
        "instruction": "Drive northwest on Steuart Street.",
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

  tripsData.map(tripData => {
    const categoryName = tripData[0].typ;

    if (categoryName.toUpperCase() === 'ERROR')     // HARDCODED
      return;

    if (categoryName.toUpperCase() === 'LEG_SWITCH')     // HARDCODED
      return;

    let category;
    if (categoryNames.indexOf(categoryName) === -1) {
      category = categorizedData[categoryName] = {
        categoryName,
        color: COLOR_OPTIONS[categoryNames.length % COLOR_OPTIONS.length],
        paths: [],
        startTime: Infinity,
        endTime: -Infinity,
        visible: true,
        minValue: Infinity,
        maxValue: -Infinity,
      };

      if (categoryName === 'WALK') {
         category.color = [85,195,74];   // HARDCODED
      } else if (categoryName === 'BUS') {
         category.color = [238,208,34];
      }else if (categoryName === 'CAR') {
         category.color = [68,178,170];
      }else if (categoryName === 'TRAM') {
         category.color = [182,113,206];
      }else if (categoryName === 'SUBWAY') {
         category.color = [234,33,45];
      }else if (categoryName === 'RAIL') {
         category.color = [182,113,206];
      }else if (categoryName === 'CABLE_CAR') {
         category.color = [182,113,206];
      }

      if (categoryName === 'CHOICE') {
        let color = category.color = {
          lowColor: CHOICE_LOW_COLOR,
          highColor: CHOICE_HIGH_COLOR
        };
        category.colorID = category.color.lowColor.concat(category.color.highColor).join('');
        category.getColor = (categoryData, path) => {
          const value = path.choiceValue;
          const normalValue = normalizeValue(categoryData.minValue, categoryData.maxValue, value);
          return normalizedColor(categoryData.color.lowColor, categoryData.color.highColor, normalValue);
        };
      }
      else {
        category.colorID = category.color.join('');
      }

      categoryNames.push(categoryName);
    }
    else {
      category = categorizedData[categoryName];
    }

    const path = tripData.map(
      leg => [leg.shp[0], leg.shp[1], leg.tim]
    );
    category.paths.push(path);

    if (path[0][2] < category.startTime) {
      category.startTime = path[0][2];
    }
    if (path[path.length - 1][2] > category.endTime) {
      category.endTime = path[path.length - 1][2];
    }

    if (categoryName === 'CHOICE') {
      const val = tripData[0].val;
      if (val < category.minValue)
        category.minValue = val;
      if (val > category.maxValue)
        category.maxValue = val;
      path.choiceValue = val;
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
