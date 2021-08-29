module.exports = function (api) {
  api.cache(true);

  const presets = ["@babel/env", "@babel/react"];
  const plugins = ["@babel/plugin-proposal-class-properties", "jsx-control-statements"];

  return {
    presets,
    plugins
  };
};