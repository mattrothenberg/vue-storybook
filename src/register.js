import {
  upperFirst,
  camelCase,
  parseKnobsObject,
  getComponentNameFromFilename
} from "./util";

export default function registerStories(req, fileName, sbInstance, plugins) {
  const { action, withKnobs, text, color, select, boolean } = plugins;
  const componentConfig = req(fileName);
  const componentName = getComponentNameFromFilename(fileName);

  const stories =
    componentConfig.__stories || componentConfig.default.__stories;
  if (!stories) return;
  stories.forEach(story => {
    const storiesOf = sbInstance(story.group || "vue-storybook", module);
    const componentFunc = () => {
      let data = story.knobs
        ? parseKnobsObject(story.knobs, {
            boolean,
            text,
            select,
            color
          })
        : {};
      return {
        components: {
          [componentName]: componentConfig.default || componentConfig
        },
        props: data,
        template: story.template,
        methods: {
          action(name, ...payload) {
            action(name)(...payload);
          }
        }
      };
    };

    story.knobs ? storiesOf.addDecorator(withKnobs) : false;

    storiesOf.add(story.name, componentFunc, {
      notes: story.notes
    });
  });
}
