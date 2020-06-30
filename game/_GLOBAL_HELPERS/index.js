// foreach that respects async
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array);
    }
  }

  // deep copies an array or object
  // https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
const deepCopyFunction = (inObject) => {
    let value, key;

    if (typeof inObject !== "object" || inObject === null) {
      return inObject;
    }

    const outObject = Array.isArray(inObject) ? [] : {};

    for (key in inObject) {
      value = inObject[key];

      outObject[key] = deepCopyFunction(value);
    }

    return outObject;
  };

  module.exports = { asyncForEach, deepCopyFunction };