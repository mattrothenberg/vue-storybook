import parseQuery from "webpack-parse-query";
import serialize from "serialize-javascript";

function generateCode(source, ctx) {
  let code = "";
  const query = parseQuery(ctx.resourceQuery);
  const story = {
    template: source.trim(),
    name: query.name,
    group: query.group,
    methods: query.methods,
    notes: query.notes,
    knobs: query.knobs,
    options: query.options,
    parameters: query.parameters
  };

  code += `function (Component) {
    Component.options.__stories = Component.options.__stories || []
    Component.options.__stories.push(${serialize(story)})
  }\n`;
  return code;
}

export default function loader(source) {
  const story = generateCode(source, this);
  this.callback(null, `module.exports = ${story}`);
}
