module.exports = function(group, vueComponent, action) {
  if (!vueComponent.__stories) return
  vueComponent.__stories.forEach(story => {
    group.add(story.name, () => ({
      components: {
        [vueComponent.name]: vueComponent
      },
      template: story.template,
      methods: eval(`(${story.methods})`)
    }))
  })
}