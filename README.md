# vue-storybook

Custom `<story>` blocks for Vue single file components

[![npm version](https://badge.fury.io/js/vue-storybook.svg)](https://badge.fury.io/js/vue-storybook)

```bash
yarn add vue-storybook
```

```js
const {
  registerStories, // Helper script
  utility,         // Util for adding loader to webpack
  storyLoader,     // Provide path String to the story loader
} = require("vue-storybook");
```

## What is this?

A **Webpack loader** + **helper script** that allows you to embellish your pre-existing Vue single file components (SFC) with a custom `<story>` block that's automatically translated into a [Storybook](https://github.com/storybooks/storybook)-flavored story.

### Hello World Example

Repo: https://github.com/mattrothenberg/vue-storybook-example

```vue
<story name="Disabled Button">
  <my-button :disabled="true">Can't touch this</my-button>
</story>
```

turns into:

![screen shot 2018-03-04 at 10 43 54 am](https://user-images.githubusercontent.com/5148596/36947401-13794112-1f99-11e8-89d8-0741cc38ee45.png)

## How does it work?

Given an existing Vue storybook project, add or modify Storybook's webpack.config.js by importing and adding our loader. This configuration work for Storybook v4 and `vue-loader` v15.

```js
const { storyLoader } = require("vue-storybook"); // Import!
module.exports = (storybookBaseConfig, configType) => {
  storybookBaseConfig.module.rules.push(
    {
      resourceQuery: /blockType=story/,
      loader: storyLoader
    }
  );
  return storybookBaseConfig;
};
```

<details>
  <summary><strong>See Integration with Storybook v3 & vue-loader ≤ v14</strong></summary>

Pass an existing Storybook's `webpack.config.js` into our `utility.configureWebpack` function.

```js
const { utility } = require('vue-storybook')

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
  const configuredConfig = utility.configureWebpack(storybookBaseConfig)
  return configuredConfig
};
```

`utility.configureWebpack` is a utility function that inject additional options into the existing `vue-loader` in order to support the `story` custom block in Vue's Single File Component.

```js
test: /\.vue$/,
use: [{
  loader: 'vue-loader',
  options: {              // <-- Injected option
    loaders: {            // <-- ...
      story: storyLoader  // <-- ...
    }                     // <-- ...
  }                       // <-- ...
}]
```

</details>

---

Add a custom `<story>` block to your single file component. The following Storybook plugins are supported:

* Actions
* Notes
* Knobs

You can optionally group components by specifiying a `group` attribute. **NB**: For reasons I still don't understand, the `group` attribute _must_ come before the `name` attribute.

```vue
  <story
    group="Buttons!"
    name="Dynamic Button"
    methods="{handleClick: action('click')}"
    notes="This is cool"
    knobs="{buttonText: text('Button text', 'initial value')}">
      <my-button @click="handleClick">
        {{ buttonText }}
      </my-button>
  </story>
```

Then, in your main `index.stories.js` (or wherever your write your stories), leverage our helper script to start adding stories

```js
// Import Storybook + all 'yr plugins!
import { storiesOf } from "@storybook/vue";
import { action } from "@storybook/addon-actions";
import { withNotes } from "@storybook/addon-notes";
import { withKnobs, text, color, select } from "@storybook/addon-knobs/vue";

// Import our helper
import { registerStories } from "vue-storybook";

// Require the Vue SFC with <story> blocks inside
const req = require.context("./", true, /\.vue$/);

// Programatically register these stories
function loadStories() {
  req.keys().forEach(filename => {
    // The last argument here is an object containing ALL of the plugins you've used in your SFC.
    registerStories(req, filename, storiesOf, {
      withKnobs,
      withNotes,
      action,
      text
    });
  });
}

// Let's go!
loadStories();
```

## Roadmap

* [x] Actions
* [x] Knobs
* [x] Notes
