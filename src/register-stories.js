const Vue = require('vue').default
const upperFirst = require('lodash').upperFirst
const camelCase = require('lodash').camelCase

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
  const componentName = upperFirst(
    camelCase(
      fileName
        .replace(/^\.\/[\W_]*?/, '')
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
    Vue.component(componentName, componentConfig.default || componentConfig)
  })
}

module.exports = registerStories