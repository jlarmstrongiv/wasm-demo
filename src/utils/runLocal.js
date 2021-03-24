const importWasm = require("./importWasm");
const { WASI } = require("./wasiPolyfill");
const predict = require("./predict");

const runLocal = async function (inputData, fileName) {
  console.log("Trying to run task locally.");

  // instantiate polyFill
  let polyFill;
  try {
    polyFill = new WASI();
  } catch (err) {
    console.log("Unable to instantiate WASI polyfill: " + err);
    throw new Error("Unable to instantiate WASI polyfill");
  }

  // import the WASI
  let cf;
  try {
    cf = await importWasm(fileName, polyFill);
  } catch (err) {
    console.log("Unable to import WASI module: " + err);
    throw new Error("Unable to import WASI module.");
  }

  // do prediction
  let output;
  try {
    output = predict(cf, inputData);
  } catch (err) {
    console.log("Unable to generate prediction: " + err);
    throw new Error("Unable to generate prediction.");
  }

  console.log("Local task generated output: " + JSON.stringify(output));

  return output;
};
module.exports = runLocal;
