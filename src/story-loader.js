const loaderUtils = require("loader-utils");
const serialize = require("serialize-javascript");

module.exports = function(source) {
  const story = generateCode(source, this);
  this.callback(null, `module.exports = ${story}`);
};

function generateCode(source, ctx) {
  let code = "";

  const options = Object.assign(
    (loaderUtils.getOptions(ctx) || {}), // vue-loader <= v14
    loaderUtils.parseQuery(ctx.resourceQuery || "?"), // vue-loader >= v15
  );
  const story = {
    template: source.trim(),
    name: options.name || "",
    group: options.group || "Stories",
    methods: options.methods,
    notes: options.notes,
    knobs: options.knobs
  };

  code += `function (Component) {
    Component.options.__stories = Component.options.__stories || []
    Component.options.__stories.push(${serialize(story)})
  }\n`;
  return code;
}
