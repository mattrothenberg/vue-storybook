const loaderUtils = require('loader-utils')
const serialize = require('serialize-javascript')

module.exports = function (source) {
  const story = generateCode(source, this)
  this.callback(null, `module.exports = ${story}`)
}

function generateCode (source, ctx) {
  let code = ''
  const story = {
    template: source.trim(),
    name: loaderUtils.getOptions(ctx).name || '',
    methods: loaderUtils.getOptions(ctx).methods
  } 

  code += `function (Component) {
    Component.options.__stories = Component.options.__stories || []
    Component.options.__stories.push(${serialize(story)})
  }\n`
  return code
}