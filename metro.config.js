const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// ensure Metro knows to load cjs and mjs files
config.resolver = config.resolver || {};
config.resolver.sourceExts = Array.from(new Set([...(config.resolver.sourceExts || []), "cjs", "mjs"]));

module.exports = withNativeWind(config, { input: "./app/global.css" });
