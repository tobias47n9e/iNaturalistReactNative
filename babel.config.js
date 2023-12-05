module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "react-native-worklets-core/plugin",
    "transform-inline-environment-variables",
    "nativewind/babel",
    ["module-resolver", {
      alias: {
        api: "./src/api",
        components: "./src/components",
        dictionaries: "./src/dictionaries",
        i18n: "./src/i18n",
        images: "./src/images",
        // for some reason, this doesn't seem to work for models, so I'm leaving that directory out
        navigation: "./src/navigation",
        providers: "./src/providers",
        realmModels: "./src/realmModels",
        sharedHelpers: "./src/sharedHelpers",
        sharedHooks: "./src/sharedHooks",
        stores: "./src/stores",
        styles: "./src/styles"
      }
    }],
    // Reanimated 2 plugin has to be listed last https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/
    // react-native-vision-camera v3
    // "react-native-reanimated/plugin",
    // react-native-vision-camera v2
    [
      "react-native-reanimated/plugin",
      {
        globals: ["__inatVision"]
      }
    ]
  ],
  env: {
    production: {
      plugins: ["react-native-paper/babel", "transform-remove-console"]
    }
  }
};
