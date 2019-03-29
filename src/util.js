function upperFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function camelCase(str) {
  let s =
    str &&
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      .join("");
  return s.slice(0, 1).toLowerCase() + s.slice(1);
}

function parseKnobsObject(obj, plugins) {
  return Function(
    `return ({ text, boolean, number, select, color, radios, date, files, object, array, optionsKnob, button }) => (${obj})`
  )()(plugins);
}

function looseJsonParse(obj) {
  return Function('"use strict";return (' + obj + ")")();
}

function getComponentNameFromFilename(fileName) {
  return upperFirst(
    camelCase(fileName.replace(/^\.\/[\W_]*?/, "").replace(/\.\w+$/, ""))
  );
}

export {
  camelCase,
  upperFirst,
  parseKnobsObject,
  getComponentNameFromFilename,
  looseJsonParse
};
