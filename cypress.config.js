const { defineConfig } = require('cypress');
const imageDiff = require('cypress-image-diff-js/dist/plugin');

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 960,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      imageDiff(on, config); // 引入插件
      return config;
    }
  }
});
