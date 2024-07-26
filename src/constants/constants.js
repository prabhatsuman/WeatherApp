const API_KEY = process.env.EXPO_PUBLIC_API_KEY

const conditionMappings = {
  day: {
    sunny: [1000],
    cloudy: [1003, 1006, 1009],
    rainy: [1063, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246, 1273, 1276],
    stormy: [1087, 1279, 1282],
    snowy: [1066, 1069, 1072, 1114, 1117, 1147, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282],
    foggy: [1030, 1135]
  },
  night: {
    clear: [1000],
    cloudy: [1003, 1006, 1009],
    rainy: [1063, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246, 1273, 1276],
    stormy: [1087, 1279, 1282],
    snowy: [1066, 1069, 1072, 1114, 1117, 1147, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282],
    foggy: [1030, 1135]
  }
};

const getGeneralizedCategory = (code, isDay) => {
  const period = isDay ? 'day' : 'night';
  for (const [category, codes] of Object.entries(conditionMappings[period])) {
    if (codes.includes(code)) {
      return category;
    }
  }
  return 'unknown';
};

const getBackgroundColor = (category, isDay) => {
  const period = isDay ? 'day' : 'night';
  const colors = {
    day: {
      sunny: '#FFD700', // Gold
      cloudy: '#B0C4DE', // LightSteelBlue
      rainy: '#87CEFA', // LightSkyBlue
      stormy: '#778899', // LightSlateGray
      snowy: '#FFFFFF', // White
      foggy: '#D3D3D3', // LightGray
      unknown: '#FFFFFF' // Default to white
    },
    night: {
      clear: '#191970', // MidnightBlue
      cloudy: '#2F4F4F', // DarkSlateGray
      rainy: '#4682B4', // SteelBlue
      stormy: '#2F4F4F', // DarkSlateGray
      snowy: '#B0E0E6', // PowderBlue
      foggy: '#696969', // DimGray
      unknown: '#000000' // Default to black
    }
  };
  return colors[period][category] || colors[period]['unknown'];
};

export { API_KEY, getGeneralizedCategory, getBackgroundColor };
