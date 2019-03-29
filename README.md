# vue-storybook

Custom `<story>` blocks for Vue single file components

[![npm version](https://badge.fury.io/js/vue-storybook.svg)](https://badge.fury.io/js/vue-storybook)

```bash
yarn add vue-storybook
```

```js
const { storyLoader, registerStories } = require("vue-storybook");
```

## What is this?

A **Webpack loader** + **helper script** that allows you to embellish your pre-existing Vue single file components (SFC) with a custom `<story>` block that's automatically translated into a [Storybook](https://github.com/storybooks/storybook)-flavored story.

### Hello World Example

Repo: https://github.com/mattrothenberg/vue-storybook-example-project

```vue
<story name="Disabled Button">
  <my-button :disabled="true">Can't touch this</my-button>
</story>
```

turns into:

![screen shot 2018-03-04 at 10 43 54 am](https://user-images.githubusercontent.com/5148596/36947401-13794112-1f99-11e8-89d8-0741cc38ee45.png)

## How does it work?

Given an existing Vue CLI + `vue-cli-plugin-storybook` project, modify your project's `vue.config.js` thusly.

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.resolve.symlinks(false);
  },
  configureWebpack: config => {
    config.module.rules.push({
      resourceQuery: /blockType=story/,
      loader: "vue-storybook"
    });
  }
};
```

Add a custom `<story>` block to your single file component. The following Storybook plugins/APIs are supported:

- Actions
- Story Options
- Notes
- Knobs

You can optionally group components by specifiying a `group` attribute.

```vue
<story
  options="{
    panelPosition: 'right'
  }"
  name="with knobs"
  group="MyButton"
  notes="### this is the coolest story ever"
  knobs="{
    initialText: {
      default: text('Initial Text', 'default value goes here')
    },
    isDisabled: {
      default: boolean('Is Disabled?', false)
    }
  }"
>
  <my-button :disabled="isDisabled" @click="action('show me the money', isDisabled)">{{initialText}}</my-button>
</story>
```

Then, in your main `index.stories.js` (or wherever your write your stories), leverage our helper script to start adding stories. NB: the signature of `registerStories` has changed significantly.

```js
registerStories(req, filename, storiesOf, config);
```

`config` is now an object with the following keys,

```js
{
  knobs: {
    // put the knobs you plan on using
    // (things like `text` or `select`)
    // in this object
  },
  decorators: [
    // an array of decorator functions
  ],
  methods: {
    action // where action is the exported member from `addon-actions`
  }
}
```

```js
// Import Storybook + all 'yr plugins!
import { storiesOf } from "@storybook/vue";
import { action } from "@storybook/addon-actions";
import { withNotes } from "@storybook/addon-notes";
import { withKnobs, text, boolean } from "@storybook/addon-knobs/vue";

// Import our helper
import { registerStories } from "vue-storybook";

// Require the Vue SFC with <story> blocks inside
const req = require.context("./", true, /\.vue$/);

// Programatically register these stories
function loadStories() {
  req.keys().forEach(filename => {
    let config = {
      knobs: {
        text,
        boolean
      },
      decorators: [
        withKnobs,
        function(context, story) {
          return {
            template: `
              <div><story /></div>`
          };
        }
      ],
      methods: {
        action
      }
    };

    registerStories(req, filename, storiesOf, config);
  });
}

// Let's go!
loadStories();
```

## Roadmap

- [x] Actions
- [x] Knobs
- [x] Notes
- [ ] Info
- [ ] Readme
