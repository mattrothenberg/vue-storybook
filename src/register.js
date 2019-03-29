import {
  upperFirst,
  camelCase,
  parseKnobsObject,
  getComponentNameFromFilename
} from "./util";

export default function registerStories({req, fileName, sbInstance, plugins, decorators, storyOptions}) {
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
    if(decorators){
    decorators.forEach((decor) => {
      storiesOf.addDecorator(decor);
      });
    }
    story.knobs ? storiesOf.addDecorator(withKnobs) : false;

    var readmeOptions = storyOptions.readme;
    var readmeContent = readmeOptions.singleFileComponentBlockEnabled ? componentConfig.default.__docs : componentConfig.default.readme;
    var readmeConfiguration = {
      sidebar: readmeOptions.displaySidebar ? readmeContent : '',
      content: readmeOptions.displayContent ? readmeContent : '',
    };

    storiesOf.add(story.name, componentFunc, {
      notes: story.notes,
      ...storyOptions,
      readme: {
        ...readmeConfiguration
      },
    });
  });
}
