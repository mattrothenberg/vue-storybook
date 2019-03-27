import {
  upperFirst,
  camelCase,
  parseKnobsObject,
  getComponentNameFromFilename
} from "./util";

  const {
    action,
    withKnobs,
    text,
    boolean,
    number,
    select,
    color,
    radios,
    date,
    files,
    object,
    array,
    optionsKnob,
    button
  } = plugins;
  const componentConfig = req(fileName);
  const componentName = getComponentNameFromFilename(fileName);

  const stories =
    componentConfig.__stories || componentConfig.default.__stories;
  if (!stories) return;
  stories.forEach(story => {
    const storiesOf = sbInstance(story.group || "vue-storybook", module);
    const componentFunc = () => {
      let data = story.knobs ?
        parseKnobsObject(story.knobs, {
            text,
          boolean,
          number,
            select,
          color,
          radios,
          date,
          files,
          object,
          array,
          optionsKnob,
          button
        }) : {};
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
