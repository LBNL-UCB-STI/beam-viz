export const REFRESH_INTERVAL = 100;
export const MAP_STYLES = [
  {
    style: "Streets",
    url: "mapbox://styles/mapbox/streets-v10",
    accessToken: "pk.eyJ1IjoicndsYm5sIiwiYSI6ImNqMGU3bjE5YjAxMDkzM3F5emQxcHU4ZnUifQ.WnLnWmzjvp9d1dvi3egHwQ"
  },
  {
    style: "Light",
    url: "mapbox://styles/mapbox/light-v9",
    accessToken: "pk.eyJ1IjoicndsYm5sIiwiYSI6ImNqMGU3bjE5YjAxMDkzM3F5emQxcHU4ZnUifQ.WnLnWmzjvp9d1dvi3egHwQ"
  },
  {
    style: "Satellite",
    url: "mapbox://styles/mapbox/satellite-v9",
    accessToken: "pk.eyJ1IjoicndsYm5sIiwiYSI6ImNqMGU3bjE5YjAxMDkzM3F5emQxcHU4ZnUifQ.WnLnWmzjvp9d1dvi3egHwQ"
  },
  {
    style: "Satellite Streets",
    url: "mapbox://styles/mapbox/satellite-streets-v10",
    accessToken: "pk.eyJ1IjoicndsYm5sIiwiYSI6ImNqMGU3bjE5YjAxMDkzM3F5emQxcHU4ZnUifQ.WnLnWmzjvp9d1dvi3egHwQ"
  },
  {
    style: "Dark",
    url: "mapbox://styles/mapbox/dark-v9",
    accessToken: "pk.eyJ1IjoicndsYm5sIiwiYSI6ImNqMGU3bjE5YjAxMDkzM3F5emQxcHU4ZnUifQ.WnLnWmzjvp9d1dvi3egHwQ"
  },
  {
    style: "Dark - No Label",
    url: "mapbox://styles/rwlbnl/cj0e7o9f6000r2skgfjsutrg9",
    accessToken: "pk.eyJ1IjoicndsYm5sIiwiYSI6ImNqMGU3bjE5YjAxMDkzM3F5emQxcHU4ZnUifQ.WnLnWmzjvp9d1dvi3egHwQ"
  },
];

export const COLOR_OPTIONS = [[100, 240, 100], [253, 128, 93], [0, 204, 255], [255, 255, 0]];
export const CATEGORY_COLORS = {
  CAR: [68, 129, 178],
  WALK: [85, 195, 74],
  SUBWAY: [181, 255, 252],
  BUS: [238, 208, 34],
  TAXI: [234, 33, 45],
  TRAM: [113, 32, 141],
  RAIL: [238, 87, 243],
  CABLE_CAR: [255, 255, 255],
  CHOICE: {
    lowColor: [150, 150, 150],
    highColor: [127, 23, 29],
  },
};
