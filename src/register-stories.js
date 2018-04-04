const Vue = require('vue')

const capitalize = ([first, ...rest], lowerRest = false) =>
  first.toUpperCase() + (lowerRest ? rest.join('').toLowerCase() : rest.join(''));

const camelCase = str => {
  let s =
    str &&
    str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      .join('');
  return s.slice(0, 1).toLowerCase() + s.slice(1);
};

function registerStories (req, fileName, sb, plugins) {
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
    date
  } = plugins
  const componentConfig = req(fileName)
  const componentName = capitalize(
    camelCase(
      fileName
        .replace(/^\.\/_/, '')
        .replace(/\.\w+$/, '')
    )
  )

  const stories = componentConfig.__stories || componentConfig.default.__stories
  if (!stories) return
  stories.forEach(story => {
    console.log(story)
    let addFunc
    let baseFunc = () => {
      let data = story.knobs ? eval(`(${story.knobs})`) : {}
      return {
        data () {
          return data
        },
        template: story.template,
        methods: eval(`(${story.methods})`)
      }
    }

    story.notes
    ? addFunc = withNotes(story.notes)(baseFunc)
    : addFunc = baseFunc

    sb(story.name, module).add(story.name, addFunc)
    Vue.default.component(componentName, componentConfig.default || componentConfig)
  })
}

module.exports = registerStories