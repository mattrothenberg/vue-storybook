# vue-storybook
Custom `<story>` blocks for Vue single file components

[![npm version](https://badge.fury.io/js/vue-storybook.svg)](https://badge.fury.io/js/vue-storybook)

```bash
yarn add vue-storybook
```

```js
const { storyLoader, generateStories } = require('vue-storybook')
```

## What is this?
A **Webpack loader** + **helper script** that allows you to embellish your pre-existing Vue single file components (SFC) with a custom `<story>` block that's automatically translated into a [Storybook](https://github.com/storybooks/storybook)-flavored story.

```vue
<story name="Disabled Button">
  <my-button :disabled="true">Can't touch this</my-button>
</story>
```

turns into:

![screen shot 2018-03-04 at 10 43 54 am](https://user-images.githubusercontent.com/5148596/36947401-13794112-1f99-11e8-89d8-0741cc38ee45.png)

## How does it work?
Given an existing Vue storybook project, add or modify Storybook's `webpack.config.js` by importing and adding our loader.

```js
const { storyLoader } = require('vue-storybook') // Import!
module.exports = (storybookBaseConfig, configType) => {
  storybookBaseConfig.module.rules[1].options = {
    loaders: {
      'story': storyLoader // Add!
    }
  }
  return storybookBaseConfig;
};
```

Then, in your main `index.stories.js` (or wherever your write your stories), import our helper script and run it!
```js
import { generateStories } from 'vue-storybook'
import MyButton from './MyButton.vue';

// Save our "stories" object so we can pass it to our helper script
const MyButtonStories = storiesOf('Button', module)

// Run our helper script by passing ^^, as well as the component that you wish to document
generateStories(MyButtonStories, MyButton)
```

## Roadmap
As it stands, the `<story>` block only supports simple, named stories. I'd love help in adding support for the following features:

- [ ] Actions
- [ ] Knobs
- [ ] Links
- [ ] Notes
- [ ] Multi-component support?

