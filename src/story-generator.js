function storyGenerator (plugins) {
  const { action, withNotes } = plugins

  this.generateStories = function(group, vueComponent) {
    this.action = action
    
    if (!vueComponent.__stories) return
    vueComponent.__stories.forEach(story => {
      let addFunc
      let baseFunc = () => ({
        components: {
          [vueComponent.name]: vueComponent
        },
        template: story.template,
        methods: eval(`(${story.methods})`)
      })
  
      story.notes
      ? addFunc = withNotes(story.notes)(baseFunc)
      : addFunc = baseFunc
  
      group.add(story.name, addFunc)
    })
  }
}

module.exports = storyGenerator