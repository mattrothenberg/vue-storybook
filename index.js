const storyLoader = require.resolve('./src/story-loader.js')
const generateStories = require('./src/generate-stories.js')

module.exports = {
  generateStories,
  storyLoader
}