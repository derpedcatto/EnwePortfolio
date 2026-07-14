module.exports = {
  plugins: [
    require("postcss-preset-env")({
      features: {
        // The polyfill emulates @layer with :not(#\#) specificity hacks, computed
        // per file. Svelte compiles each component's <style> separately, so its
        // layer boosts never line up with the global sheet's and cross-file layer
        // order breaks. @layer is natively supported by every browser we target.
        "cascade-layers": false,
      },
    }),
  ],
};
