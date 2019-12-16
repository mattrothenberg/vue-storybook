import {
  upperFirst,
  camelCase,
  parseKnobsObject,
  looseJsonParse,
  getComponentNameFromFilename
} from "./util";

const initialConfig = {
  knobs: {},
  decorators: [],
  methods: {}
};

function buildStory({ story, component, name, storiesOf }, config) {
  const { methods, knobs, decorators } = config;
  const storiesOfInstance = storiesOf(story.group || "vue-storybook", module);
  const componentFunc = () => {
    let data = story.knobs ? parseKnobsObject(story.knobs, knobs) : {};
    return {
      components: {
        [name]: component.default || component
      },
      props: data,
      template: story.template,
      methods: {
        action(name, ...payload) {
          if (methods.action) {
            methods.action(name)(...payload);
          } else {
            console.warn("You forgot to add the action method!");
          }
        }
      }
    };
  };

  if (decorators) {
    decorators.forEach(storiesOfInstance.addDecorator);
  }

  storiesOfInstance.add(story.name, componentFunc, {
    notes: story.notes,
    ...(story.options ? { options: looseJsonParse(story.options) } : null),
    ...(story.parameters ? looseJsonParse(story.parameters) : null)
  });
}

export default function registerStories(
  req,
  fileName,
  storiesOf,
  config = initialConfig
) {
  const component = req(fileName);
  const name = getComponentNameFromFilename(fileName);

  const stories =
    component.__stories ||
    component.default.__stories ||
    (component.default.options || {}).__stories;

  if (!stories) return;
  stories.forEach(story =>
    buildStory({ story, name, component, storiesOf }, config)
  );
}
