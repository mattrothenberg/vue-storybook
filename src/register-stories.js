const Vue = require("vue").default;
const upperFirst = require("lodash").upperFirst;
const camelCase = require("lodash").camelCase;

function registerStories(req, fileName, sbInstance, plugins, extensions = {}) {
  const {
    action,
    withNotes,
    text,
    boolean,
    number,
    color,
    object,
    array,
    select,
    date,
    withKnobs
  } = plugins;
  const componentConfig = req(fileName);
  const componentDefault = componentConfig.default || componentConfig;

  const stories = componentDefault.__stories;

  if (!stories) return;
  stories.forEach(story => {
    let storiesOf = sbInstance(story.group, module);
    let addFunc;
    let baseFunc = () => {
      let data = story.knobs ? eval(`(${story.knobs})`) : {};
      return Object.assign({}, extensions, {
        data() {
          return data;
        },
        template: story.template,
        methods: eval(`(${story.methods})`)
      });
    };

    story.notes
      ? (addFunc = withNotes(story.notes)(baseFunc))
      : (addFunc = baseFunc);

    story.knobs ? storiesOf.addDecorator(withKnobs) : false;

    storiesOf.add(story.name, addFunc);

    const componentName = componentDefault.name || upperFirst(
      camelCase(fileName.replace(/^\.\/[\W_]*?/, "").replace(/\.\w+$/, ""))
    );
    Vue.component(componentName, componentDefault);
  });
}

module.exports = registerStories;
