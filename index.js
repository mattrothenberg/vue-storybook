const storyLoader = require.resolve("./src/story-loader.js");
const registerStories = require("./src/register-stories.js");
const utility = require("./src/utility/index.js");

module.exports = {
  storyLoader,
  registerStories,
  utility
};
