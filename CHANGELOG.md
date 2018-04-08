# Vue Storybook Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## 0.3.0

- Breaking API change around story registration.

- As per https://github.com/mattrothenberg/vue-storybook/issues/3, stories are now automatically registered by the very presence of tags in a given component.

```js
import { registerStories } from 'vue-storybook'
import { configure } from '@storybook/vue';

const req = require.context('./', true, /\.vue$/)
function loadStories() {
  req.keys().forEach((filename) => {
    registerStories(req, filename, storiesOf, {})
  })
}
loadStories()
```
