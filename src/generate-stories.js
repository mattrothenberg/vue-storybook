module.exports = function(group, vueComponent) {
  if (!vueComponent.__stories) return
  vueComponent.__stories.forEach(story => {
    group.add(story.name, () => ({
      components: {
        [vueComponent.name]: vueComponent
      },
      template: story.template
    }))
  })
}