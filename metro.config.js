/* eslint-env node */
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql"); // SQLite
const { withNativeWind } = require("nativewind/metro"); // Nativewind

module.exports = withNativeWind(config, { input: "./global.css" });
