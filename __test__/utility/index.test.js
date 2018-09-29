const { storyLoader } = require('../../index.js');
const utility = require('../../src/utility/index.js');

const makeConfigWithRules = (rules) => ({ module: { rules }});
const VUE_LOADER_PATH = 'path/node_modules/vue-loader/index.js';
const VUE_LOADER_TESTER = /\.vue$/;
const makeStandardConfiguredOutput = () => ({
  loader: VUE_LOADER_PATH,
  options: { loaders: { story: storyLoader }},
});

test('should inject storybook option into existing vue-loader', () => {
  const inputConfig = makeConfigWithRules([
    {
      test: /\.vue$/,
      loaders: [
        { loader: VUE_LOADER_PATH }
      ]
    },
  ]);
  const outputConfig = makeConfigWithRules([
    {
      test: /\.vue$/,
      loaders: [makeStandardConfiguredOutput()]
    },
  ]);

  expect(utility.configureWebpack(inputConfig)).toEqual(outputConfig);
});

test('should inject storybook option to rule that test for vue file', () => {
  const inputConfig = makeConfigWithRules([
    {
      test: /\.(jsx?)|(vue)$/,
      loaders: [
        { loader: VUE_LOADER_PATH }
      ]
    },
  ]);
  const outputConfig = makeConfigWithRules([
    {
      test: /\.(jsx?)|(vue)$/,
      loaders: [makeStandardConfiguredOutput()]
    },
  ]);

  expect(utility.configureWebpack(inputConfig)).toEqual(outputConfig);
});

test('should not inject storybook option if doesn\'t contain vue-loader', () => {
  const inputConfig = makeConfigWithRules([
    {
      test: /\.vue$/,
      loaders: [
        { loader: 'babel-loader' }
      ]
    },
  ]);
  const outputConfig = makeConfigWithRules([
    {
      test: /\.vue$/,
      loaders: [
        { loader: 'babel-loader' }
      ]
    },
  ]);

  expect(utility.configureWebpack(inputConfig)).toEqual(outputConfig);
});

test('should inject storybook option into more than one vue-loader', () => {
  const inputConfig = makeConfigWithRules([
    { test: /\.vue$/,
      loaders: [{ loader: VUE_LOADER_PATH }]
    },
    { test: /\.vue$/,
      loaders: [
        { loader: VUE_LOADER_PATH },
        { loader: VUE_LOADER_PATH },
      ]
    },
  ]);
  const outputConfig = makeConfigWithRules([
    { test: /\.vue$/,
      loaders: [makeStandardConfiguredOutput()]
    },
    { test: /\.vue$/,
      loaders: [
        { loader: VUE_LOADER_PATH, options: { loaders: { story: storyLoader }}},
        { loader: VUE_LOADER_PATH, options: { loaders: { story: storyLoader }}},
      ],
    },
  ]);

  expect(utility.configureWebpack(inputConfig)).toEqual(outputConfig);
});

test('should inject by expanding loader into loaders syntax', () => {
  const inputConfig = makeConfigWithRules([
    {
      test: /\.vue$/,
      loader: VUE_LOADER_PATH,
    },
  ]);
  const outputConfig = makeConfigWithRules([
    {
      test: /\.vue$/,
      use: [makeStandardConfiguredOutput()]
    },
  ]);

  expect(utility.configureWebpack(inputConfig)).toEqual(outputConfig);
});

test('should inject into loader with use syntax', () => {
  const inputConfig = makeConfigWithRules([
    {
      test: /\.vue$/,
      use: [
        {
          loader: VUE_LOADER_PATH,
        }
      ],
    },
  ]);
  const outputConfig = makeConfigWithRules([
    {
      test: /\.vue$/,
      use: [makeStandardConfiguredOutput()]
    },
  ]);

  expect(utility.configureWebpack(inputConfig)).toEqual(outputConfig);
});

test('should inject by expanding inline use syntax', () => {
  const inputConfig = makeConfigWithRules([
    {
      test: /\.vue$/,
      use: [
        VUE_LOADER_PATH
      ],
    },
  ]);
  const outputConfig = makeConfigWithRules([
    {
      test: /\.vue$/,
      use: [makeStandardConfiguredOutput()]
    },
  ]);

  expect(utility.configureWebpack(inputConfig)).toEqual(outputConfig);
});

test('should inject without losing other loader properties', () => {
  const inputConfig = makeConfigWithRules([
    {
      test: /\.vue$/,
      use: [{
        loader: VUE_LOADER_PATH,
        options: {
          optionA: {
            itemA: 1,
            itemB: 2,
          },
        },
      }],
    },
  ]);
  const outputConfig = makeConfigWithRules([
    {
      test: /\.vue$/,
      use: [{
        loader: VUE_LOADER_PATH,
        options: {
          optionA: {
            itemA: 1,
            itemB: 2,
          },
          loaders: {
            story: storyLoader,
          },
        },
      }]
    },
  ]);

  expect(utility.configureWebpack(inputConfig)).toEqual(outputConfig);
});

test('should work when there are multiple rules', () => {
  const inputConfig = makeConfigWithRules([
    { test: /\.jsx?$/,
      loader: 'babel-loader',
      query: [Object],
      include: [Array],
      exclude: [Array]
    },
    { test: /\.vue$/,
      loader: VUE_LOADER_PATH,
      options: {}
    },
    { test: /\.md$/,
      use: [Array]
    }
  ]);
  const outputConfig = makeConfigWithRules([
    { test: /\.jsx?$/,
      loader: 'babel-loader',
      query: [Object],
      include: [Array],
      exclude: [Array]
    },
    { test: /\.vue$/,
      use: [makeStandardConfiguredOutput()],
    },
    { test: /\.md$/,
      use: [Array]
    }
  ]);

  expect(utility.configureWebpack(inputConfig)).toEqual(outputConfig);
});