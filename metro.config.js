const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
  // Ensure this is set for proper CSS processing
  isCSSEnabled: true,
});

module.exports = withNativeWind(config, { input: './global.css' });
