const loaderUtils = require('loader-utils')

module.exports = function (source) {
  const story = generateCode(source, this)
  this.callback(null, `module.exports = ${story}`)
}

function generateCode (source, ctx) {
  let code = ''
  const story = {
    template: source.trim(),
    name: loaderUtils.getOptions(ctx).name || ''
  } 

  code += `function (Component) {
    Component.options.__stories = Component.options.__stories || []
    Component.options.__stories.push(${JSON.stringify(story)})
  }\n`
  return code
}