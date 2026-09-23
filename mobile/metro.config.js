const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// O entry "react-native" do lucide-react-native aponta para .mjs.
config.resolver.sourceExts.push("mjs");

module.exports = config;
