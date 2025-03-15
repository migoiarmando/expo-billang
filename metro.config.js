/* --------------------------------------------------------------------------------------------------------------

    Last edited: 
        John Bicierro [March 15, 2025]

    Company: github.com/codekada
    Project: github.com/jkbicierro/expo-billang

-------------------------------------------------------------------------------------------------------------- */

const { withNativeWind } = require("nativewind/metro");

/* eslint-env node */
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...config.resolver.sourceExts, "svg"],
};

module.exports = withNativeWind(config, { input: "./global.css" });
