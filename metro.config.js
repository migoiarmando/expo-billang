/* eslint-env node */
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.transformer = {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver = {
    assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...config.resolver.sourceExts, "svg"],
};

const { withNativeWind } = require("nativewind/metro"); // Nativewind

module.exports = withNativeWind(config, { input: "./global.css" });
