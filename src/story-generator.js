function storyGenerator (plugins) {
  const { action, withNotes, text } = plugins

  this.generateStories = function(group, vueComponent) {
    if (!vueComponent.__stories) return
    vueComponent.__stories.forEach(story => {
      let addFunc
      let baseFunc = () => {
        let data = story.knobs ? eval(`(${story.knobs})`) : {}
        return {
          components: {
            [vueComponent.name]: vueComponent
          },
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
  
      group.add(story.name, addFunc)
    })
  }
}

module.exports = storyGenerator